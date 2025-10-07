import { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Fonts } from "@/constants/theme";
import Printer from "@/components/printer";

export default function HomeScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const requestPermissions = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const mediaLibraryPermission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (
      cameraPermission.status !== "granted" ||
      mediaLibraryPermission.status !== "granted"
    ) {
      Alert.alert(
        "Permissions Required",
        "Camera and photo library permissions are required to use this feature.",
      );

      return false;
    }

    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();

    if (!hasPermission) {
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const pickFromLibrary = async () => {
    const hasPermission = await requestPermissions();

    if (!hasPermission) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const generateImage = async () => {
    if (!selectedImage) {
      Alert.alert("No Image", "Please select or take a photo first.");

      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();

      const filename = selectedImage.split("/").pop() || "photo.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image/jpeg";

      formData.append("image", {
        uri: selectedImage,
        name: filename,
        type: type,
      } as any);

      const apiUrl = process.env.API_URL;

      const response = await fetch(`${apiUrl}/generate`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.ok) {
        const data = await response.json();

        Alert.alert("Success", "Image processed successfully!");

        console.log("API Response:", data);
      } else {
        Alert.alert("Error", `Failed to process image: ${response.status}`);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to send image to server.");

      console.error("API Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}
        >
          Home
        </ThemedText>
      </ThemedView>
      <ThemedText>Take a photo or choose one from your library.</ThemedText>

      <Printer />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.secondaryButton} onPress={takePhoto}>
          <IconSymbol name="camera.fill" size={20} color="#007AFF" />
          <ThemedText style={styles.secondaryButtonText}>Take Photo</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={pickFromLibrary}
        >
          <IconSymbol name="photo.fill" size={20} color="#007AFF" />
          <ThemedText style={styles.secondaryButtonText}>
            Choose from Library
          </ThemedText>
        </TouchableOpacity>
      </View>

      {selectedImage && (
        <View style={styles.imageContainer}>
          <ThemedText style={styles.imageLabel}>Selected Photo:</ThemedText>
          <Image source={{ uri: selectedImage }} style={styles.image} />
        </View>
      )}

      {selectedImage && (
        <TouchableOpacity
          style={[
            styles.primaryButton,
            isLoading && styles.primaryButtonDisabled,
          ]}
          onPress={generateImage}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <IconSymbol name="sparkles" size={24} color="#fff" />
              <ThemedText style={styles.primaryButtonText}>Generate</ThemedText>
            </>
          )}
        </TouchableOpacity>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: "row",
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#007AFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 12,
    gap: 6,
  },
  secondaryButtonText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "600",
  },
  primaryButton: {
    backgroundColor: "#007AFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 20,
  },
  primaryButtonDisabled: {
    backgroundColor: "#7CB4FF",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  imageContainer: {
    marginTop: 24,
    gap: 8,
    alignItems: "center",
  },
  imageLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 12,
    resizeMode: "cover",
  },
});
