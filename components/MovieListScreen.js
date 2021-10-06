import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} from 'react-native';
import axios from 'axios';

export default function MovieListScreen({ navigation }) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios
      .get(
        'https://api.themoviedb.org/3/movie/now_playing?api_key=9d571cb3bf9a2fc082acd53b3ef6b38e'
      )
      .then((response) => {
        setMovies(response.data.results);
      });
  }, []);

  function MoviesList(props) {
    const itemPressed = (index) => {
      props.navigation.navigate('MovieDetails', { movie: movies[index] });
    };

    if (movies.length === 0) {
      return (
        <View style={{ flex: 1, padding: 20 }}>
          <Text>Loading, please wait...</Text>
        </View>
      );
    }
    let movieItems = movies.map(function (movie, index) {
      return (
        <TouchableHighlight
          onPress={(_) => itemPressed(index)}
          underlayColor="lightgray"
          key={index}
        >
          <MovieListItem movie={movie} key={index} />
        </TouchableHighlight>
      );
    });

    return <ScrollView>{movieItems}</ScrollView>;
  }

  function MovieListItem(props) {
    let IMAGEPATH = 'http://image.tmdb.org/t/p/w500';
    let imageurl = IMAGEPATH + props.movie.poster_path;
    const itemPressed = (index) => {
      props.navigation.navigate('MovieDetails');
    };

    return (
      <View style={styles.movieItem}>
        <View style={styles.movieItemImage}>
          <Image
            source={{ uri: imageurl }}
            style={{ width: 99, height: 146 }}
          />
        </View>
        <View style={styles.infoContainer}>
          <View>
            <Text style={styles.movieItemTitle}>{props.movie.title}</Text>
            <Text style={styles.movieItemDate}>{props.movie.release_date}</Text>
            <Text numberOfLines={6} ellipsizeMode="tail">
              {props.movie.overview}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <MoviesList navigation={navigation} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  movieItem: {
    marginHorizontal: 5,
    marginVertical: 8,
    flex: 1,
    flexDirection: 'row',
  },
  movieItemImage: {
    marginRight: 5,
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  movieItemTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  movieItemDate: {
    marginVertical: 5,
    fontSize: 12,
  },
  movieItemText: {
    fontSize: 16,
  },
});
