/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Dimensions
} from 'react-native';

var TimerMixin = require('react-timer-mixin');

var ImageData = require('./Data/data.json');

var width = Dimensions.get('window').width;

var scrollAndListView = React.createClass({
   mixins: [TimerMixin],


  getDefaultProps(){
    return{
      duration:2000
    }

  },


  getInitialState(){
    return{
      //当前的页码
      currentPage:0
    }
  },

  render(){
    return (
        <View style={styles.container}>
          <ScrollView
              ref="scrollView"
              horizontal={true}
              //隐藏水平滚动条
              showsHorizontalScrollIndicator={false}
              pagingEnabled={true}
              //当一帧滚动结束时调用
              onMomentumScrollEnd={(scrollView)=>this.onAnimationEnd(scrollView)}
              //当手拖拽的时候调用
              onScrollBeginDrag={()=>this.onScrollBeginDrag()}
              onScrollEndDrag={()=>this.onScrollEndDrag()}
          >
            {this.renderAllImage()}
          </ScrollView>
          <View style={styles.pageViewStyle}>
            {this.renderPageCircle()}
          </View>
        </View>

    );
  },

  //实现比较复杂的操作
  componentDidMount(){
    this.startTimer();
  },

  //开启定时器
  startTimer(){
    //拿到ScrollView
    var scrollView = this.refs.scrollView;
    var imgCount = ImageData.data.length;

    //添加定时器
    this.timer = this.setInterval(function () {
      // console.log("1");

      //设置圆点
      var activePage=0;
      //判断
      if((this.state.currentPage+1)>=imgCount){
          //越界
          activePage = 0;
      }else {
        activePage = this.state.currentPage+1;
      }

      //更新状态机
      this.setState({
         currentPage:activePage
      });

      //让scrollView滚动
      var offSetX = activePage * width;
      scrollView.scrollResponderScrollTo({x:offSetX,y:0,animated:true});

    },this.props.duration);

  },


  renderAllImage(){
    //数组
    var allImage = [];

    var imageArray = ImageData.data;
    //遍历
    for(var i=0;i<imageArray.length;i++){
      var imgItem = imageArray[i];
      //创建组件装入数组
      allImage.push(
          <Image key={i} source={{uri:imgItem.img}}
                 style={{width:width,height:130}}></Image>
      );
    }

    //返回数组
    return allImage;
  },

  renderPageCircle(){
    //定义数组放置所有圆点
    var indicatorArray = [];
    var imageArray = ImageData.data;

    var style;


    //遍历
    for(let i=0;i<imageArray.length;i++){

      style = (i==this.state.currentPage)?{color:'orange'}:{color:'white'};

      //把圆点装入数组
      indicatorArray.push(
          <Text key={i} style={[{fontSize:25},style]}>&bull;</Text>
      );
    }

    return indicatorArray;
  },


  onAnimationEnd(scrollView){
    //求出水平方向偏移量
    var offSetX = scrollView.nativeEvent.contentOffset.x;

    //求出当前页数
    var currentPage = Math.floor(offSetX/width);
    // console.log(currentPage);

    this.setState({
      currentPage:currentPage
    });

  },

  //调用开始拖拽
  onScrollBeginDrag(){
      //停止定时器
      this.clearInterval(this.timer);
  },
  onScrollEndDrag(){
      this.startTimer();
  }
});


const styles = StyleSheet.create({
  container: {
    marginTop:20,
  },

  pageViewStyle:{
    width:width,
    height:30,
    backgroundColor:'rgba(0,0,0,0.5)',

    position:'absolute',
    bottom:0,

    //设置主轴方向
    flexDirection:'row',

    alignItems:'center'
  }
});

AppRegistry.registerComponent('scrollAndListView', () => scrollAndListView);
