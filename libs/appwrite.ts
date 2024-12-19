import { Client, Account, ID, Databases, Query } from 'react-native-appwrite';
import { PrivacyItem, Guide, App } from './data';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('676348540000648202c6'); //Project ID - Please dont steal :C

const databases = new Databases(client);

// IDs for appwrite DB - removed due to being public on github.
const DATABASE_ID = ' ';
const COLLECTION_ID = ' ';
const PRIVACY_COLLECTION_ID = ' '; 
const GUIDES_COLLECTION_ID = ' '; 



export const fetchApps = async (): Promise<App[]> => {
    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID
        );

        // Fetch both guide counts and privacy note counts for all apps
        const appStats = await Promise.all(
            response.documents.map(async (doc) => {
                const [guides, privacyNotes] = await Promise.all([
                    databases.listDocuments(
                        DATABASE_ID,
                        GUIDES_COLLECTION_ID,
                        [Query.equal('app_name', doc.name)]
                    ),
                    databases.listDocuments(
                        DATABASE_ID,
                        PRIVACY_COLLECTION_ID,
                        [Query.equal('app_name', doc.name)]
                    )
                ]);
                return {
                    appName: doc.name,
                    guidesCount: guides.total,
                    notesCount: privacyNotes.total
                };
            })
        );

        return response.documents.map(doc => {
            const stats = appStats.find(s => s.appName === doc.name);
            return {
                id: doc.$id,
                name: doc.name,
                category: doc.category,
                icon: doc.icon,
                banner: doc.banner,
                rating: doc.rating || 0,
                notes: stats?.notesCount || 0,
                guides: stats?.guidesCount || 0
            };
        });
    } catch (error) {
        console.error('Error fetching apps:', error);
        return [];
    }
};

const getIconForStatus = (status: PrivacyItem['status']): PrivacyItem['icon'] => {
  switch (status) {
    case 'positive':
      return 'check';
    case 'warning':
      return 'alert-triangle';
    case 'negative':
      return 'x';
  }
};

export const fetchPrivacyItems = async (appName: string): Promise<PrivacyItem[]> => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      PRIVACY_COLLECTION_ID,
      [
        Query.equal('app_name', appName)
      ]
    );

    return response.documents.map(doc => ({
      id: doc.$id,
      title: doc.title,
      description: doc.description,
      status: doc.status,
      icon: getIconForStatus(doc.status)  // Determine icon based on status
    }));
  } catch (error) {
    console.error('Error fetching privacy items:', error);
    return [];
  }
};

export const fetchGuides = async (appName: string): Promise<Guide[]> => {
  try {
    console.log('Fetching guides for app:', appName);
    const response = await databases.listDocuments(
      DATABASE_ID,
      GUIDES_COLLECTION_ID,
      [
        Query.equal('app_name', appName)
      ]
    );

    console.log('Raw guides response:', response.documents);
    
    const guides = response.documents.map(doc => ({
      id: doc.$id,
      title: doc.title,
      time: doc.time,
      app_name: doc.app_name
    }));

    console.log('Processed guides:', guides);
    return guides;
  } catch (error) {
    console.error('Error fetching guides:', error);
    return [];
  }
};

    