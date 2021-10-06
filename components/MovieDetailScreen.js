import React, { useState, useEffect, useCallback } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  Linking,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import YoutubePlayer from 'react-native-youtube-iframe';

export default function MovieDetailScreen(props) {
  const { route } = props;
  const { movie } = route.params;
  let IMAGEPATH = 'http://image.tmdb.org/t/p/w500';
  let imageurl = IMAGEPATH + movie.backdrop_path;

  const [movieDetail, setMovieDetail] = useState('');
  const [genres, setGenres] = useState('');
  const [trailers, setTrailers] = useState('');
  const [trailerKeys, setTrailerKeys] = useState([]);

  const [playing, setPlaying] = useState(false);

  const onStateChange = useCallback((state) => {
    if (state === 'ended') {
      setPlaying(false);
      Alert.alert('video has finished playing!');
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        let response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movie.id}?api_key=9d571cb3bf9a2fc082acd53b3ef6b38e`
        );
        let data = await response.data;
        setMovieDetail(data);
        let movieGenres = data.genres.map((genre) => genre.name + ' ');
        setGenres(movieGenres);
      } catch (error) {
        console.error(error.message);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        let response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=9d571cb3bf9a2fc082acd53b3ef6b38e&language=en-US`
        );
        let data = await response.data.results;
        setTrailers(data);
        setTrailerKeys(
          ...trailerKeys,
          data.map((trailer) => trailer.key)
        );
      } catch (error) {
        console.error('man errorrr');
      }
    }
    fetchData();
  }, []);

  function TrailersList() {
    if (trailerKeys.lenght === 0) {
      return (
        <View style={{ flex: 1, padding: 20 }}>
          <Text>Sorry mate no trailers have been released yet</Text>
        </View>
      );
    }

    let trailerItems = trailerKeys.map(function (key) {
      return (
        <View key={key}>
          <YoutubePlayer
            height={250}
            play={playing}
            videoId={`${key}`}
            onChangeState={onStateChange}
          />
        </View>
      );
    });
    return <ScrollView>{trailerItems}</ScrollView>;
  }
  return (
    <View>
      <ScrollView>
        <Image source={{ uri: imageurl }} style={styles.image} />
        <View style={styles.container}>
          <Text style={styles.title}>{movie.title}</Text>
          <Text style={styles.textDate}>{movie.release_date}</Text>
          <Text style={styles.text}>{movie.overview}</Text>
          <Text style={styles.text}>Genres: {genres}</Text>
          <Text style={styles.text}>Runtime: {movieDetail.runtime} mins.</Text>
          <View>
            <Text style={styles.textCenter}>Homepage:</Text>
            <TouchableOpacity
              style={styles.textCenter}
              onPress={() => {
                Linking.openURL(`${movieDetail.homepage}`);
              }}
            >
              <Text style={{ color: 'blue', paddingLeft: 5, paddingBottom: 0 }}>
                {movieDetail.homepage}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.textCenter}>Trailers:</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <TrailersList />
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  image: {
    aspectRatio: 16 / 9,
  },
  container: {
    marginHorizontal: 5,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 10,
    marginBottom: 5,
  },
  textDate: {
    fontSize: 15,
    flexWrap: 'wrap',
    marginBottom: 5,
  },
  text: {
    margin: 5,
  },
  textCenter: {
    margin: 5,
    alignSelf: 'center',
  },
});
