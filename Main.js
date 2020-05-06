import React, { Component } from 'react'
import {View, Text,StyleSheet,Alert,Image} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';

import {
    Appbar,
    List,
    Divider,
    Searchbar,
} from "react-native-paper";

export class Main extends Component {
    state = {
        text:"City",
        title: "City",
        searchQuery: "",
        showSearch: false,
        expanded:false
    }
    async componentDidMount(){
        city =  await AsyncStorage.getItem("city");
        this.change(city)
        // console.log(city);
    }
    change = (city) => {
        // this.setState({title:city,expanded:false})
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metricss&appid=4d866478b033e279bc3884183efe3a61`)
        .then(data=> data.json())
        .then(async data2 => {
            if (data2.cod == 200){
                this.setState({
                    desc: data2.weather[0].description,
                    icon:data2.weather[0].icon,
                    min: String(parseFloat(data2.main.temp_min) - 273.15).slice(0,4),
                    max: String(parseFloat(data2.main.temp_max) - 273.15).slice(0,4),
                    hum: data2.main.humidity,
                    feel: String(parseFloat(data2.main.feels_like) - 273.15).slice(0,4),
                    temp: String(parseFloat(data2.main.temp) - 273.15).slice(0,4),
                    title: city,
                    expanded: false
                })
                await AsyncStorage.setItem("city",city)
                // console.log(data2)
            }
            else{Alert.alert("Not Found !","City name you have entered, Not Found")}
        }).catch(() =>{Alert.alert("No Net connection ","Please Connect to the Internet !")});
        
    }
    _handlePress=() => {this.setState({expanded:!this.state.expanded}) }
    _handleSearch = () => {this.setState({showSearch:!this.state.showSearch})};
    _onChangeSearch = (query) => {
        this.setState({ searchQuery: query })
    };
    findCity = () => {
        // cosole.log(this.state)
        this.change(this.state.searchQuery)
    }
    
    render() {
        return (
            <View>
                <Appbar.Header>
                    <Appbar.Content title="Weather App"/>
                    <Appbar.Action icon="magnify" onPress={this._handleSearch} />
                </Appbar.Header>
                { this.state.showSearch ?
                    (
                        <Searchbar
                            placeholder="Search City"
                            onChangeText={this._onChangeSearch}
                            value={this.state.searchQuery}
                            autoFocus ={true}
                            onSubmitEditing = {this.findCity}
                        />
                    ):(
                        <Text></Text>
                    )
                }
                <List.Section>
                    <List.Accordion
                        title= {this.state.title}
                        left={props => <List.Icon icon="city" />}
                        expanded={this.state.expanded}
                        onPress={this._handlePress}
                    >
                        <List.Item title="Bhopal" onPress={()=>this.change("Bhopal")}/>
                        <List.Item title="Indore" onPress={()=>this.change("Indore")}/>
                        <List.Item title="Delhi" onPress={()=>this.change("Delhi")}/>
                        <List.Item title="Bangalore" onPress={()=>this.change("Bangalore")}/>
                    </List.Accordion>
                </List.Section>
                {this.state.title != "City" ?
                (
                <View style={styles.container}>
                    <View style={{flexDirection:"row",backgroundColor:"#f4f4f4",padding:10}}>
                        <View>
                            <Text style={{fontSize:35}}>{this.state.title}</Text>
                            <Text>{this.state.desc}</Text>
                        </View>
                        <View style={{marginLeft:"auto"}}>
                            <Image source={{uri:`http://openweathermap.org/img/w/${this.state.icon}.png`}} style={{width:100,height:100}} />
                        </View>
                    </View>
                    <Divider style={{marginVertical:20}}/>
                    <View style={{flexDirection:"row",alignItems:"center"}}>
                        <Text style={{fontSize:43}}>{this.state.temp} C  </Text>
                        <View style={{flexDirection:"column",}}>
                            <Text style={{fontWeight:"bold"}}>Detail</Text>
                            <Divider style={{marginTop:10}}/>
                            <Text>max temparature: {this.state.max}</Text>
                            <Text>min temparature: {this.state.min}</Text>
                            <Text>Humidity: {this.state.hum} %</Text>
                            <Text>Feels like: {this.state.feel} </Text>
                        </View>
                    </View>
                    <Divider style={{marginVertical:20}}/>
                </View>
                    ):(
                        <Text style={{padding:120}}>Not City Selected</Text>
                    )
                }
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flexDirection:"column",
        marginHorizontal:40,
        marginTop:10
    },
    center: {
        
        padding:30,
        flexDirection:"column",
        alignItems:"center",
        flexDirection:"column",
        backgroundColor:"#fffff0",
        fontSize:51
    },
    

})

export default Main
