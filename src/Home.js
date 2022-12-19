import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  TextInput,
  TouchableOpacity,
} from 'react-native';
// import CustomButton from '../utils/CustomButton';
// import GlobalStyle from '../utils/GlobalStyle';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  {
    name: 'MainDB',
    location: 'default',
  },
  () => {},
  error => {
    console.log(error);
  },
);

export default function Home({navigation, route}) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    try {
      // AsyncStorage.getItem('UserData')
      //     .then(value => {
      //         if (value != null) {
      //             let user = JSON.parse(value);
      //             setName(user.Name);
      //             setAge(user.Age);
      //         }
      //     })
      db.transaction(tx => {
        tx.executeSql('SELECT Name, Age FROM Users', [], (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            var userName = results.rows.item(0).Name;
            var userAge = results.rows.item(0).Age;
            setName(userName);
            setAge(userAge);
          }
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  const updateData = async () => {
    if (name.length == 0) {
      Alert.alert('Warning!', 'Please write your data.');
    } else {
      try {
        // var user = {
        //     Name: name
        // }
        // await AsyncStorage.mergeItem('UserData', JSON.stringify(user));
        db.transaction(tx => {
          tx.executeSql(
            'UPDATE Users SET Name=?',
            [name],
            () => {
              Alert.alert('Success!', 'Your data has been updated.');
            },
            error => {
              console.log(error);
            },
          );
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const removeData = async () => {
    try {
      // await AsyncStorage.clear();
      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM Users',
          [],
          () => {
            navigation.navigate('Login');
          },
          error => {
            console.log(error);
          },
        );
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.body}>
      <Text style={styles.text}>Welcome {name} !</Text>
      <Text style={styles.text}>Your age is {age}</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        placeholderColor="#ccc"
        value={name}
        onChangeText={value => setName(value)}
      />

      <TouchableOpacity
        style={{
          width: 150,
          height: 50,
          alignItems: 'center',
          borderRadius: 5,
          margin: 10,
          backgroundColor: 'green',
        }}
        onPress={updateData}>
        <Text
          style={{
            color: '#ccc',
            fontSize: 20,
            margin: 10,
            textAlign: 'center',
          }}>
          Update
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          width: 150,
          height: 50,
          alignItems: 'center',
          borderRadius: 5,
          margin: 10,
          backgroundColor: 'red',
        }}
        onPress={removeData}>
        <Text
          style={{
            color: '#ccc',
            fontSize: 20,
            margin: 10,
            textAlign: 'center',
          }}>
          Remove
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 40,
    margin: 10,
  },
  input: {
    width: 300,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    textAlign: 'center',
    fontSize: 20,
    marginTop: 130,
    marginBottom: 10,
    height: 50,
  },
});
