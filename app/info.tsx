import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Types ---

type TopNavProps = {
  title?: string;
  onBack: () => void;
};

type HeroProps = {
  imageUrl: string;
  name: string;
  scientificName?: string;
};

type InfoTableProps = {
  title: string;
  data: { label: string; value: string }[];
};

// --- Component 1: Top Navigation (Header) ---
const TopNavigation: React.FC<TopNavProps> = ({ title, onBack }) => {
  return (
    <SafeAreaView edges={['top']} style={styles.navContainer}>
      <View style={styles.navContent}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="white" />
        </TouchableOpacity>
        
        {/* Если нужно название в хедере, можно раскомментировать */}
        {/* <Text style={styles.navTitle}>{title}</Text> */}
        
        {/* Пустой блок справа для баланса, если заголовок по центру */}
        <View style={{ width: 40 }} />
      </View>
    </SafeAreaView>
  );
};

// --- Component 2: Fruit Hero (Image + Title) ---
const FruitHero: React.FC<HeroProps> = ({ imageUrl, name, scientificName }) => {
  return (
    <View style={styles.heroContainer}>
      <Image 
        source={{ uri: imageUrl }} 
        style={styles.heroImage} 
        resizeMode="cover" 
      />
      <View style={styles.heroTextOverlay}>
        <Text style={styles.fruitName}>{name}</Text>
        {scientificName && (
          <Text style={styles.scientificName}>{scientificName}</Text>
        )}
      </View>
    </View>
  );
};

// --- Component 3: Reusable Info Table ---
// Этот компонент мы будем использовать для таблиц БЖУ и прочего
const InfoTable: React.FC<InfoTableProps> = ({ title, data }) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.tableContainer}>
        {data.map((item, index) => (
          <View key={index} style={[
            styles.tableRow, 
            index === data.length - 1 && styles.noBorder // Убираем черту у последнего
          ]}>
            <Text style={styles.tableLabel}>{item.label}</Text>
            <Text style={styles.tableValue}>{item.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// --- Main Screen Component ---
export default function FruitDetailScreen({ navigation }: any) {
  const router = useRouter();
  
  // Моковые данные (потом придут с сервера)
  const fruitData = {
    name: "Apple",
    scientificName: "Malus domestica",
    description: "The apple is a pome (fleshy) fruit, in which the ripened ovary and surrounding tissue both become fleshy and edible. The apple flower of most varieties requires cross-pollination for fertilization.",
    imageUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    nutrition: [
      { label: "Calories", value: "52 kcal" },
      { label: "Carbs", value: "14 g" },
      { label: "Sugar", value: "10 g" },
      { label: "Fiber", value: "2.4 g" },
    ],
    vitamins: [
      { label: "Vitamin C", value: "14%" },
      { label: "Potassium", value: "107 mg" },
    ]
  };

  const handleBack = () => {
    console.log("Go back!");
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* 1. Header (Fixed at top) */}
      <TopNavigation onBack={handleBack} title="Details" />

      {/* 2. Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Hero Section */}
        <FruitHero 
          imageUrl={fruitData.imageUrl} 
          name={fruitData.name} 
          scientificName={fruitData.scientificName}
        />

        {/* Description Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>
            {fruitData.description}
          </Text>
        </View>

        {/* Tables (Future additions) */}
        <InfoTable title="Nutrition (100g)" data={fruitData.nutrition} />
        <InfoTable title="Vitamins & Minerals" data={fruitData.vitamins} />

        {/* Bottom padding for safe scrolling */}
        <View style={{ height: 40 }} />

      </ScrollView>
    </View>
  );
}

// --- Styles ---
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black', // Основной фон как в камере
  },
  
  // --- Nav Styles ---
  navContainer: {
    backgroundColor: 'black',
    zIndex: 10,
  },
  navContent: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  navTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },

  // --- Scroll Styles ---
  scrollContent: {
    paddingBottom: 20,
  },

  // --- Hero Styles ---
  heroContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  heroImage: {
    width: width,
    height: 300,
  },
  heroTextOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    // Градиент или полупрозрачный фон для читаемости текста на картинке
    backgroundColor: 'rgba(0,0,0,0.6)', 
  },
  fruitName: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  scientificName: {
    color: '#ccc',
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: 4,
  },

  // --- Section & Table Styles ---
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    color: '#FFD700', // Используем тот же желтый цвет, что был у вспышки
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  descriptionText: {
    color: '#E0E0E0',
    fontSize: 16,
    lineHeight: 24,
  },

  // Table styling (iOS Settings style dark mode)
  tableContainer: {
    backgroundColor: '#1C1C1E', // Темно-серый фон плашки
    borderRadius: 12,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#38383A', // Разделитель
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  tableLabel: {
    color: 'white',
    fontSize: 16,
  },
  tableValue: {
    color: '#A0A0A0', // Чуть более тусклый для значений
    fontSize: 16,
  },
});