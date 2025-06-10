import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(
          'https://newsapi.org/v2/everything', {
          params: {
            q: 'gaming',
            apiKey: '5566266c65b34cc99727459b4f73c56f',
          },
        });
        setNews(response.data.articles.slice(0,30));
      } catch (error) {
        console.error("Eroare preluare noutăți:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const renderItem = ({ item }) => {
    if (item.title.includes("[Removed]") || item.description.includes("[Removed]")) {
      return null;
    }
    return (
      <View style={styles.newsContainer}>
        <Ionicons name={'game-controller'} size={30} color={'#2ca243'}/>
        <Text style={styles.newsTitlu}>{item.title}</Text>
        <Text style={styles.newsDescriere}>{item.description}</Text>
      </View>
    );
  };



  return (
    <View style={styles.container}>
      <Text style={styles.titlu}>Noutăți</Text>
      <FlatList
        data={news}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.url + index}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BBD1EA',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  titlu:{
    fontSize: 25, 
    fontWeight: '500',
    textAlign: 'center',
    backgroundColor:'#071330',
    color:'white',
    paddingHorizontal: 110,
    paddingVertical:10,
    borderRadius:10,
  },
  newsContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    width: '100%',
  },
  newsTitlu: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  newsDescriere: {
    fontSize: 14,
    marginTop: 5,
  },
});
