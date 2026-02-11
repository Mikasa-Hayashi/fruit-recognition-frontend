import { StyleSheet, View } from 'react-native';
import CameraScreen from './camera-screen';

export default function Index() {
  return (
    <View style={styles.container}>
      <CameraScreen />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 }
})
