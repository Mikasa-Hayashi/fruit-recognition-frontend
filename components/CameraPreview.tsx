import { CameraView } from 'expo-camera'
import { RefObject } from 'react'
import { StyleSheet } from 'react-native'

type CameraPreviewProps = {
  cameraRef: RefObject<CameraView | null>
  torchEnabled: boolean
}

export default function CameraPreview({
  cameraRef,
  torchEnabled
}: CameraPreviewProps) {
  return (
    <CameraView
      ref={cameraRef}
      style={styles.camera}
      facing="back"
      enableTorch={torchEnabled}
    />
  )
}

const styles = StyleSheet.create({
  camera: { flex: 1 }
})
