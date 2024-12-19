import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, Image, Modal, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from '@expo/vector-icons';
import { App } from '../../libs/data';
import { fetchApps } from '../../libs/appwrite';
import { router } from 'expo-router';

// Move FilterModal outside the main component
const FilterModal = ({ 
  visible, 
  onClose, 
  categories, 
  selectedCategories, 
  onToggleCategory, 
  onClearAll 
}: {
  visible: boolean;
  onClose: () => void;
  categories: string[];
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
  onClearAll: () => void;
}) => (
  <Modal
    visible={visible}
    animationType="slide"
    transparent={true}
    onRequestClose={onClose}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Filter by Category</Text>
          <TouchableOpacity 
            onPress={onClose}
            style={styles.closeButton}
          >
            <Feather name="x" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.categoryList}>
          {categories.map(category => (
            <TouchableOpacity
              key={category}
              style={styles.categoryItem}
              onPress={() => onToggleCategory(category)}
            >
              <Text style={styles.categoryText}>{category}</Text>
              {selectedCategories.includes(category) && (
                <Feather name="check" size={20} color="#007AFF" />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.modalFooter}>
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={onClearAll}
          >
            <Feather name="trash-2" size={16} color="#666" />
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.applyButton}
            onPress={onClose}
          >
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [apps, setApps] = React.useState<App[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const loadApps = async () => {
      try {
        const fetchedApps = await fetchApps();
        setApps(fetchedApps);
      } catch (error) {
        console.error('Error loading apps:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadApps();
  }, []);

  // Extract unique categories from APPS
  const categories = Array.from(new Set(apps.map(app => app.category)));

  const filteredItems = apps.filter(item =>
    (searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    ) &&
    (selectedCategories.length === 0 || selectedCategories.includes(item.category))
  );

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <View style={styles.filterContainer}>
          <View style={styles.sortButton}>
            <Feather name="sliders" size={16} color="#000" />
            <Text style={styles.filterButtonText}>Sort</Text>
          </View>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilterModal(true)}
          >
            <Feather name="filter" size={16} color="#000" />
            <Text style={styles.filterButtonText}>Category</Text>
            {selectedCategories.length > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{selectedCategories.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.productGrid}
        contentContainerStyle={styles.productGridContent}
      >
        {filteredItems.map(item => (
          <TouchableOpacity 
            key={item.id}
            onPress={() => router.push(`/app-details?id=${item.id}`)}
          >
            <View style={styles.productCard}>
              <View style={styles.imageContainer}>
                <Image 
                  source={{ uri: item.banner }}
                  style={styles.bannerImage}
                  resizeMode="cover"
                />
                <View style={styles.logoContainer}>
                  <Image
                    source={{ uri: item.icon }}
                    style={styles.logo}
                  />
                </View>
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productCategory}>{item.category}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <FilterModal 
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        categories={categories}
        selectedCategories={selectedCategories}
        onToggleCategory={toggleCategory}
        onClearAll={() => setSelectedCategories([])}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    gap: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    borderRadius: 8,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: 'transparent',
    gap: 6,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: 'transparent',
    gap: 6,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filterBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  filterBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  productGrid: {
    flex: 1,
  },
  productGridContent: {
    padding: 16,
    flexDirection: 'column',
    gap: 16,
  },
  productCard: {
    width: '100%',
    backgroundColor: '#fff',
    flexDirection: 'column',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 16/9,
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  productInfo: {
    gap: 2,
  },
  productName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  productCategory: {
    fontSize: 11,
    color: '#666',
  },
  logoContainer: {
    position: 'absolute',
    left: 12,
    bottom: 12,
    width: 60,
    height: 60,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  categoryList: {
    maxHeight: 400,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryText: {
    fontSize: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  clearButtonText: {
    color: '#666',
    fontSize: 16,
  },
  applyButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 