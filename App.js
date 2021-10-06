import React, { useState, useEffect } from 'react';
import { FlatList, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform, Keyboard, Alert, } from 'react-native';
import { Ioinicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [task, setTask] = useState([]);
  const [newTask, setNewTask] = useState('');


async function addTask() {
  if(newTask === '') {
    return;
  }


  const search = task.filter(task => task === newTask);

  if(search.length !== 0) {
    Alert.alert('Atenção', 'Tarefa já existente!');
    return;
  }

  setTask([ ...task,newTask]);
  setNewTask('');
  Keyboard.dismiss();
}

async function removeTask(item) {
  Alert.alert(
    "Deletar Tarefa",
    "Você tem certeza que deseja remover esta tarefa?",
    [
      {
        text:'Cancelar',
        onPress: () => {
          return;
        }, style: "cancel"
      },
      {
        text: 'Remover',
        onPress: () =>  setTask(task.filter(tasks => tasks !== item))
      }
    ],
    {cancelable: false }
  );
  
}


useEffect(() => {
  async function carregaDados() {
    const task = await AsyncStorage.getItem("task");

    if (task) {
      setTask(JSON.parse(task));
    }
  }
  carregaDados();
}, []);

useEffect(() => {
  async function salvaDados() {
    AsyncStorage.setItem('task', JSON.stringify(task));
  }
  salvaDados();
}, [task]);




  return (
    <>
   <KeyboardAvoidingView
      keyboardVerticalOffset={0}
      behavior='padding'
      style={{flex: 1}}
      enabled={Platform.OS === 'ios' }
   >
    <View style={styles.container}>
      <View style={styles.Body}>
        <FlatList 
          style={styles.FlatList} 
          data={task}
          keyExtractor={item => item.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.ContainerView}>
              <Text style={styles.Text}>{item}</Text>
              <TouchableOpacity onPress={() => removeTask(item)}>
                <MaterialIcons name='delete-forever' size={24} color='#f64c75' />
              </TouchableOpacity>

            </View>

          )}
        
        />
      </View>
            <View><Text style={{textAlign:'right', color: '#ffffff11'}}>versão 1.0.0 - by @pedrodespessel</Text></View>

      <View style={styles.Form}>
        
        <TextInput 
        style={styles.Input}
        placeholderTextColor="#999"
        autoCorrect={true}
        placeholder="Adicione uma tarefa"
        maxLength={25}
        onChangeText={text => setNewTask(text)}
        value={newTask}
        />
        <TouchableOpacity style={styles.Button} onPress={() => addTask()}>
        <MaterialIcons name="add-task" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 20
  },
  Body: {
    flex: 1
  },
  Form: {
    padding: 0,
    height: 60,
    justifyContent: 'center',
    alignSelf: 'stretch',
    flexDirection: 'row',
    paddingTop: 13,
    borderTopWidth: 1,
    borderColor: '#eee'
  },
  Input: {
    flex: 1,
    height: 40,
    backgroundColor: '#eee',
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#eee'
  },
  Button: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c6cce',
    borderRadius: 4,
    marginLeft: 10
  },
  FlatList: {
    flex: 1,
    marginTop: 5
  },
  ContainerView: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 4,
    backgroundColor: '#eee',

    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#eee'
  },
Text: {
  fontSize: 16,
  color: '#333',
  fontWeight: 'bold',
  marginTop: 4,
  textAlign: 'center'

}

});
