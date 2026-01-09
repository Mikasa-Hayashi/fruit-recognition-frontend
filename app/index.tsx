import CameraControls from '@/components/CameraControls'
import CameraPreview from '@/components/CameraPreview'
import { CameraView } from 'expo-camera'
import { useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'

export default function Index() {
  const cameraRef = useRef<CameraView | null>(null)
  const [flash, setFlash] = useState<'off' | 'torch'>('off')
  const [torchEnabled, setTorchEnabled] = useState(false)

  const takePhoto = async () => {
    if (!cameraRef.current) return
    const photo = await cameraRef.current.takePictureAsync()
    console.log(photo.uri)
  }

  return (
    <View style={styles.container}>
      <CameraPreview
        cameraRef={cameraRef}
        torchEnabled={torchEnabled}
      />
      <CameraControls
        torchEnabled={torchEnabled}
        onToggleTorch={() => setTorchEnabled(v => !v)}
        onTakePhoto={takePhoto}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 }
})
