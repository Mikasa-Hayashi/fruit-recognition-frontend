import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Types ---
type TopControlProps = {
  isTorchOn: boolean;
  onToggleTorch: () => void;
  onOpenMenu: () => void;
};

type BottomControlProps = {
  onTakePicture: () => void;
  onOpenGallery: () => void;
  isProcessing: boolean;
};

// --- Component 1: Top Control Panel (Opaque Black) ---
const TopControlPanel: React.FC<TopControlProps> = ({ isTorchOn, onToggleTorch, onOpenMenu }) => {
  return (
    <SafeAreaView style={styles.topPanelContainer}>
      <View style={styles.topPanelContent}>
        {/* Меню (слева) */}
        <TouchableOpacity onPress={onOpenMenu} style={styles.iconButton}>
          <Ionicons name="menu" size={28} color="white" />
        </TouchableOpacity>
        
        {/* Вспышка (справа) */}
        <TouchableOpacity onPress={onToggleTorch} style={styles.iconButton}>
          <Ionicons 
            name={isTorchOn ? "flash" : "flash-off"} 
            size={28} 
            color={isTorchOn ? "#FFD700" : "white"} 
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// --- Component 2: QR Code Frame (Center Overlay) ---
const QRScannerFrame: React.FC = () => {
  return (
    <View style={styles.qrFrameContainer}>
      <View style={styles.qrFrame}>
        <View style={[styles.corner, styles.topLeft]} />
        <View style={[styles.corner, styles.topRight]} />
        <View style={[styles.corner, styles.bottomLeft]} />
        <View style={[styles.corner, styles.bottomRight]} />
      </View>
      <Text style={styles.qrText}>Scan fruit</Text>
    </View>
  );
};

// --- Component 3: Bottom Control Panel (Semi-Transparent) ---
const BottomControlPanel: React.FC<BottomControlProps> = ({ 
  onTakePicture, 
  onOpenGallery,
  isProcessing 
}) => {
  return (
    <View style={styles.bottomPanelContainer}>
      <View style={styles.bottomControlsRow}>
        
        {/* Gallery Button (Left) */}
        <TouchableOpacity onPress={onOpenGallery} style={styles.galleryButton}>
          <Ionicons name="images" size={28} color="white" />
        </TouchableOpacity>

        {/* Shutter Button (Center) */}
        <TouchableOpacity 
          onPress={onTakePicture} 
          disabled={isProcessing}
          style={styles.shutterButtonOuter}
        >
          <View style={[
            styles.shutterButtonInner, 
            isProcessing && { backgroundColor: '#ccc' } // Visual feedback when loading
          ]} />
        </TouchableOpacity>

        {/* Empty View to balance layout (Right) */}
        <View style={styles.emptySpacer} />
        
      </View>
    </View>
  );
};

// --- Main Screen Component ---
export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTorchOn, setIsTorchOn] = useState(false);
  
  const cameraRef = useRef<CameraView>(null);

  // Initial Permissions Check
  useEffect(() => {
    if (!permission?.granted) requestPermission();
    if (!mediaPermission?.granted) requestMediaPermission();
  }, []);

  if (!permission || !mediaPermission) {
    return <View />; // Loading state
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', color: 'white' }}>
          We need your permission to show the camera
        </Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permButton}>
          <Text style={{ color: 'black' }}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- Logic Functions ---

  const handleToggleTorch = () => {
    setIsTorchOn(prev => !prev);
  };

  const handleOpenGallery = () => {
    // In a real app, you would navigate to an ImagePicker or Gallery Screen
    Alert.alert("Gallery", "Opening Gallery...");
  };

  const sendToServer = async (photoUri: string) => {
    // Mock Server Request
    console.log("Sending to server:", photoUri);
    return new Promise((resolve) => setTimeout(resolve, 1500));
  };

  const handleTakePicture = async () => {
    if (cameraRef.current) {
      try {
        setIsProcessing(true);
        const photo = await cameraRef.current.takePictureAsync();
        
        if (photo) {
          // 1. Send request to server
          await sendToServer(photo.uri);
          
          // 2. (Optional) Save to local gallery
          await MediaLibrary.saveToLibraryAsync(photo.uri);
          
          Alert.alert("Success", "Photo taken and request sent!");
        }
      } catch (error) {
        Alert.alert("Error", "Failed to take picture.");
        console.error(error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleOpenMenu = () => {
    Alert.alert("Menu", "Opening menu...");
  };

  return (
    <View style={styles.container}>
      
      {/* 1. Opaque Top Panel (Z-Index high to sit on top) */}
      <View style={styles.topOpaqueBlock}>
        <TopControlPanel 
          isTorchOn={isTorchOn} 
          onToggleTorch={handleToggleTorch} 
          onOpenMenu={handleOpenMenu}
        />
      </View>

      {/* 2. Camera View (Fills remaining space) */}
      <View style={styles.cameraContainer}>
        <View style={styles.cameraWrapper}>
          <CameraView 
            ref={cameraRef}
            style={styles.camera} 
            enableTorch={isTorchOn}
          >
            {/* QR Overlay sits inside the camera view */}
            <QRScannerFrame />
          </CameraView>
        </View>

        {/* 3. Semi-Transparent Bottom Panel (Absolute overlay) */}
        <BottomControlPanel 
          onTakePicture={handleTakePicture} 
          onOpenGallery={handleOpenGallery}
          isProcessing={isProcessing}
        />
      </View>
    </View>
  );
}

// --- Styles ---
const { width } = Dimensions.get('window');
const FRAME_SIZE = 250;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  permButton: {
    backgroundColor: 'white',
    padding: 10,
    marginTop: 20,
    borderRadius: 5
  },
  
  // Layout Structure
  topOpaqueBlock: {
    backgroundColor: 'black',
    zIndex: 10, // Ensure it sits on top
    // Note: Height is determined by SafeAreaView inside the component
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  cameraWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  camera: {
    width: '100%',
    aspectRatio: 3 / 4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Top Panel Styles
  topPanelContainer: {
    backgroundColor: 'black',
  },
  topPanelContent: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Pushes items to edges
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  iconButton: {
    // padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },

  // QR Frame Styles
  qrFrameContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrFrame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    position: 'relative',
  },
  qrText: {
    color: 'white',
    marginTop: 10,
    fontSize: 14,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: 'white',
    borderWidth: 4,
  },
  topLeft: { top: 0, left: 0, borderBottomWidth: 0, borderRightWidth: 0 },
  topRight: { top: 0, right: 0, borderBottomWidth: 0, borderLeftWidth: 0 },
  bottomLeft: { bottom: 0, left: 0, borderTopWidth: 0, borderRightWidth: 0 },
  bottomRight: { bottom: 0, right: 0, borderTopWidth: 0, borderLeftWidth: 0 },

  // Bottom Panel Styles
  bottomPanelContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150, // Height of the semi-transparent area
    backgroundColor: 'black', // Semi-transparent black
    justifyContent: 'center',
    paddingBottom: 20,
  },
  bottomControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 30,
  },
  galleryButton: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // iPhone-style Shutter Button
  shutterButtonOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  shutterButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  
  emptySpacer: {
    width: 50, // Matches gallery button width to keep center button centered
  },
});