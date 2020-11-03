import React, { useState, useEffect } from 'react';

import { Platform, StyleSheet, Text, View,ScrollView, } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import RNPickerSelect from 'react-native-picker-select';


const App = () => {
  
  var date = new Date().getDate(); //Current Date
  if(date<10){
    date='0'+date
  }
  var month = new Date().getMonth() + 1; //Current Month
  var year = new Date().getFullYear();
  var full=date + '/' + month + '/' + year

  let [news, setnews] = useState([]);
  let [rnvil,setrnvil]=useState('Select village');
  let [rndist,setrndist]=useState('Select district');
  let [rndate,setrndate]=useState('Sort by date');
  let [rnprice,setrnprice]=useState('Sort by price');
  let [main, setmain] = useState([]);
  let [mainvil, setmainvil] = useState([]);
  let [maindist, setmaindist] = useState([]);
  let [shvil, setshvil] = useState([]);
  let [shdist, setshdist] = useState([]);
  let [tableHead, settableHead] = useState(['Date','District','Village','Price']);
  let [sort, setsort]= useState([{label:'low to high' , value: 'low to high' },
  { label:'high to low'  ,value: 'high to low' }])
  let [sort1, setsort1]= useState([{label:'latest' , value: 'latest' },
  { label:'oldest'  ,value: 'oldest' }])
  
 
  useEffect(() => {


      console.log('updating')
        fetch('https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b&format=json&offset=0&limit=10', {
        method: 'GET',
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(responseJson => {
          var got=[]
          var vil=[]
          var dist=[]
          var svil=[]
          var sdist=[]

          for (var i = 0; i < responseJson['records'].length; i++) {
            var cars = [responseJson['records'][i]["arrival_date"],responseJson['records'][i]["district"], responseJson['records'][i]["market"],responseJson['records'][i]["modal_price"]];
            if(!vil.includes(responseJson['records'][i]["market"].trim())){
              vil.push(responseJson['records'][i]["market"].trim());
            }
            if(!dist.includes(responseJson['records'][i]["district"].trim())){
              dist.push(responseJson['records'][i]["district"].trim());
            }
            got.push(cars);
          }
          vil.sort(); 
          dist.sort(); 
          for (var i = 0; i < vil.length; i++) {
            svil.push({label:vil[i],value:vil[i]});
          }
          for (var i = 0; i < dist.length; i++) {
            sdist.push({label:dist[i],value:dist[i]});
          }
          if(main.length==0){
            setmain(got)
            setmainvil(vil)
            setmaindist(dist)
            setshvil(svil)
            setshdist(sdist)
            setnews(got)
          }
         console.log(main)
         console.log(mainvil)
         console.log(maindist)

          })

  });
  const manualvil = (val) => {
    if(val!=null){
     var vilfi=[]
     for (var i = 0; i < main.length; i++) {
        if(main[i][2]==val){
          vilfi.push(main[i])

        }
     }
     setnews(vilfi)
     setrnvil(val)
    }
    else{
      setnews(main)
      setrnvil('Select village')
    }
  }
  const manualdist = (val) => {
    if(val!=null){

    
    var distfi=[]
    for (var i = 0; i < main.length; i++) {
       if(main[i][1]==val){
        distfi.push(main[i])

       }
    }
    setnews(distfi)
    setrndist(val)
  }
  else{
    setnews(main)
    setrndist('Select district')
  }
  }
  const manualdate = (val) => {
    var abc=news
    if(val=='latest'){
      abc.sort();
    }
    else{
      abc.sort().reverse;
    }
    setnews(abc)
    if(val=='latest'){
      setrndate('latest')
      }
      else{
        setrndate('oldest')
      }
  }
  const manualprice = (val) => {
    var abc=news
    console.log(val)
    if(val=='low to high'){
      console.log("asc")
      abc.sort(function(a, b){return parseInt(a[3]) - parseInt(b[3])});
    }
    else{
      console.log("dec")
      abc.sort(function(a, b){return parseInt(b[3]) - parseInt(a[3])});
    }
    console.log(abc)
    setnews(abc)
    if(val=='low to high'){
    setrnprice('low to high')
    }
    else{
      setrnprice('high to low')
    }
  }

 
    return (

      <View style={styles.container}>
        <ScrollView>
        <View style={styles.SectionStyle1}>
           <View style={styles.inputStyle12}>
           <RNPickerSelect
              value={rnvil}
              placeholderTextColor="#8C8B8B"
              placeholder={{label: "Select village", value: null}}
              onValueChange={(itemValue, itemIndex) => manualvil(itemValue)}
              items={shvil}
                />
            </View>
            
            <View style={styles.inputStyle12}>
            <RNPickerSelect
              value={rndist}
              placeholderTextColor="#8C8B8B"
  
              placeholder={{label: "Select district", value: null}}
              onValueChange={(itemValue, itemIndex) => manualdist(itemValue)}
              items={shdist}
            />
            </View>
            </View>
            <View style={styles.SectionStyle1}>
           <View style={styles.inputStyle12}>
           <RNPickerSelect
              value={rndate}
              placeholderTextColor="#8C8B8B"
              placeholder={{label: "Sort by date", value: null}}
              onValueChange={(itemValue, itemIndex) => manualdate(itemValue)}
              items={sort1}
                />
            </View>
            
            <View style={styles.inputStyle12}>
            <RNPickerSelect
              value={rnprice}
              placeholderTextColor="#8C8B8B"
  
              placeholder={{label: "Sort by price", value: null}}
              onValueChange={(itemValue, itemIndex) => manualprice(itemValue)}
              items={sort}

            />
            </View>
            </View>
        <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
          <Row data={tableHead} style={styles.head} textStyle={styles.text}/>
          <Rows data={news} textStyle={styles.text}/>
        </Table>
        </ScrollView>
      </View>

    );
  
};
export default App;

const styles = StyleSheet.create({
  SectionStyle1: {
    
    flexDirection: 'row',
    paddingHorizontal: '1%',
    paddingTop:5
  },inputStyle12: {
    flex: 1,
    color: 'black',
    
    width: '2%',
    height:35,
    borderRadius:25,
    fontSize:16,
    marginBottom:15,
    marginHorizontal:5,
    borderColor: 'black',
  },
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6 }

});