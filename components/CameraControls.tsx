import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type CameraControlsProps = {
  torchEnabled: boolean
  onToggleTorch: () => void
  onTakePhoto: () => void
}

export default function CameraControls({
  torchEnabled,
  onToggleTorch,
  onTakePhoto
}: CameraControlsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onToggleTorch}>
        <Text>
            {torchEnabled ? 'Torch ON' : 'Torch OFF'}
            </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onTakePhoto}>
        <Text style={styles.text}>SNAP</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.text}>GALLERY</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  text: {
    color: 'white',
    fontSize: 18
  }
})
