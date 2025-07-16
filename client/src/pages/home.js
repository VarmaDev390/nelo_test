import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, FlatList, RefreshControl } from "react-native";
import {
  Appbar,
  Button,
  Card,
  FAB,
  IconButton,
  Text,
  Portal,
  Dialog,
  TextInput,
  ActivityIndicator,
  Snackbar, // Import Snackbar
} from "react-native-paper";
import { AuthContext } from "../context/authContext.js";
import Constants from "expo-constants";

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

export default function Home({ navigation }) {
  const { signOut, authToken } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [visible, setVisible] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1); // stores the current page number
  const [totalPages, setTotalPages] = useState(1); // max number of pages availble  we get it from backend
  const [loading, setLoading] = useState(false); // For initial load and pagination

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const onDismissSnackbar = () => setSnackbarVisible(false);

  const fetchPosts = async (pageToFetch = 1, appending = false) => {
    // 'appending' helps differentiate initial load/refresh from pagination
    if (loading && appending) return; // Prevent multiple pagination calls
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/post?page=${pageToFetch}`, {
        headers: {
          Authorization: authToken,
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setPosts(pageToFetch === 1 ? data.posts : [...posts, ...data.posts]); // Append new posts for pagination
      setTotalPages(data.pages);
      setPage(pageToFetch);
    } catch (error) {
      console.error("Error fetching posts:", error);
      showSnackbar("Failed to fetch posts."); // Show snackbar on error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts(1); // Initial fetch when component mounts
  }, []);

  const onRefresh = React.useCallback(() => {
    if (page === totalPages && !loading) {
      showSnackbar("No more posts to load.");
    } else if (!loading) {
      setRefreshing(true); // Set refreshing to true *before* fetching
      fetchPosts(1); // Fetch from the beginning on refresh
    }
  }, [page, totalPages, loading]);

  const loadMorePosts = () => {
    if (page < totalPages && !loading) {
      // Only load more if there are more pages and not already loading
      fetchPosts(page + 1, true); // Pass 'true' for appending
    }
  };

  // Conditionally render "Loading more posts..." at the bottom
  const renderFooter = () => {
    return loading && page < totalPages ? ( // Only show if loading *and* there are more pages
      <View style={styles.loadingIndicator}>
        <ActivityIndicator size="small" color="#6200ee" />
        <Text>Loading more posts...</Text>
      </View>
    ) : null;
  };

  const handleAddPost = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
        body: JSON.stringify({
          title: newPostTitle,
          content: newPostContent,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      showSnackbar("Post added successfully!");
      fetchPosts(1); // Re-fetch posts from the beginning to show the new post
      hideDialog();
      setNewPostTitle("");
      setNewPostContent("");
    } catch (error) {
      console.error("Error adding post:", error);
      showSnackbar("Failed to add post.");
    }
  };

  const handleSignOut = () => {
    showSnackbar("Logged out successfully.");
    signOut(navigation);
  };

  const renderPost = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title title={item.title} subtitle={`By: ${item.author.name}`} />
      <Card.Content>
        <Text>{item.content}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.Content title="Social Feed" />
        <IconButton icon="logout" onPress={handleSignOut} />
      </Appbar.Header>

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMorePosts} // This is the key prop for infinite scrolling
        onEndReachedThreshold={0.5} // How close to the end (0 to 1) before onEndReached is called
        ListFooterComponent={renderFooter} // Renders the loading indicator at the bottom
      />

      <FAB icon="plus" style={styles.fab} onPress={showDialog} />

      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>New Post</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Title"
              value={newPostTitle}
              onChangeText={setNewPostTitle}
              mode="outlined"
              style={styles.dialogInput}
            />
            <TextInput
              label="Content"
              value={newPostContent}
              onChangeText={setNewPostContent}
              mode="outlined"
              multiline
              style={styles.dialogInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button onPress={handleAddPost}>Post</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={onDismissSnackbar}
        duration={3000} // Adjust as needed
        action={{
          label: "Dismiss",
          onPress: () => {
            onDismissSnackbar();
          },
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  appbar: {
    backgroundColor: "#c77dff",
  },
  listContent: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#7b2cbf",
  },
  dialogInput: {
    marginBottom: 10,
  },
  loadingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginTop: 10, // Add some margin to separate from the last post
  },
});
