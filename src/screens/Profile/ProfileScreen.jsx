import React, { useState } from 'react'
import { Dimensions, RefreshControl, ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import styles from './styles'
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/core';
import { Feather } from '@expo/vector-icons'
import { AntDesign } from '@expo/vector-icons'; 
import { useSelector } from 'react-redux';
import useFetch from '../../hooks/useFecth'
import {
          LineChart,
          BarChart,
          PieChart,
          ProgressChart,
          ContributionGraph,
          StackedBarChart
        } from "react-native-chart-kit";
import {
          completedAffectationSelector,
          uncompletedAffectationSelector } from '../../store/selectors/affectationsSelector';
import { userSelector } from '../../store/selectors/userSelector';
import { primaryColor } from '../../components/Welcome/styles';
import { useEffect } from 'react';
import { fetchApi } from '../../functions';

const screenWidth = Dimensions.get("window").width;

export default function ProfileScreen() {
          const navigation = useNavigation()
          const completedAffectations = useSelector(completedAffectationSelector)
          const uncompletedAffectations = useSelector(uncompletedAffectationSelector)
          const chartConfig = {
                    backgroundColor: "#e26a00",
                    backgroundGradientFrom: "#fb8c00",
                    backgroundGradientTo: "#ffa726",
                    decimalPlaces: 0, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                              borderRadius: 15
                    },
                    propsForDots: {
                              r: "6",
                              strokeWidth: "2",
                              stroke: "#ffa726"
                    }
          }
          const user = useSelector(userSelector)
          const [loading, setLoading] = useState(true)
          const [report, setReport] = useState({
                    affectationsReport: [],
                    crasReport: [],
                    crasCount: 0
          })
          const fetchReport = async () => {
                    const affects = await fetchApi('/affectationsReports/'+user?.collaboId)
                    const cras = await fetchApi('/crasReports/'+user?.collaboId)
                    const crasCount = await fetchApi('/crasReports/mois/'+user?.collaboId)
                    setReport({
                              affectationsReport: affects,
                              crasReport: cras,
                              crasCount
                    })
                    setLoading(false)
                    setRefreshing(false)
          }

          const [refreshing, setRefreshing] = useState(false)
          const onRefresh = async () => {
                    setRefreshing(true)
                    fetchReport()
          }
          useEffect(() => {
                    fetchReport()
          }, [])
          const affectationsMonths = report.affectationsReport.map(data => data.month)
          const affectationsDatas = []
          for(let i = 1; i <= 12;  i++) {
                    if(affectationsMonths.includes(i)) {
                              affectationsDatas.push(report.affectationsReport.find(data => data.month == i).count)
                    } else {
                              affectationsDatas.push(0)
                    }
          }
          const crasMonths = report.crasReport.map(data => data.month)
          const crasDatas = []
          for(let i = 1; i <= 12;  i++) {
                    if(crasMonths.includes(i)) {
                              crasDatas.push(report.crasReport.find(data => data.month == i).count)
                    } else {
                              crasDatas.push(0)
                    }
          }
          return (
                    <View style={styles.profileContent}>
                              <View  style={styles.header}>
                                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBack}>
                                                  <Ionicons name="arrow-back-outline" size={24} color="black" />
                                        </TouchableOpacity>
                                        <Text style={{fontWeight: 'bold', fontSize: 18, marginLeft: 10}}>Rapport</Text>
                              </View>
                              <ScrollView
                                        showsVerticalScrollIndicator={false}
                                        refreshControl={<RefreshControl
                                                  colors={[primaryColor]} refreshing={refreshing}
                                                  onRefresh={onRefresh} />}>
                                        <View style={{paddingBottom: 100}}>
                                                  <View style={styles.dashboard}>
                                                            <View style={{paddingRight: 5, flex: 1}}>
                                                                      <View style={{...styles.countContainer, backgroundColor: primaryColor}}>
                                                                                <View style={styles.description}>
                                                                                          <Feather name="circle" size={40} color="#ebf6ff" />
                                                                                          <Text style={styles.affectationCount}>{uncompletedAffectations.length}</Text>
                                                                                          <Text style={styles.affectationLabel}>Affectations Non terminés</Text>
                                                                                </View>
                                                                      </View>
                                                            </View>
                                                            <View style={{paddingLeft: 5, flex: 1}}>
                                                                      <View style={{...styles.countContainer, backgroundColor: '#ddd'}}>
                                                                                <View style={styles.description}>
                                                                                          <AntDesign name="checkcircle" size={40} color="#000" />
                                                                                          <Text style={{...styles.affectationCount, color: '#000'}}>
                                                                                                    {loading ?
                                                                                                              <ActivityIndicator animating={true} size='large' color={'#000'}  /> :
                                                                                                              report.crasCount
                                                                                                    }
                                                                                          </Text>
                                                                                          <Text style={{...styles.affectationLabel, color: '#000'}}>CRA completés ce mois</Text>
                                                                                </View>
                                                                      </View>
                                                            </View>
                                                  </View>
                                                  <View style={{paddingRight: 15}}>
                                                            <Text style={styles.chartTitle} numberOfLines={1}>Nombre d'affectations par mois ({ new Date().getFullYear() })</Text>
                                                            <LineChart
                                                                      data={{
                                                                                labels: ["Ja", "Fé", "Ma", "Ap", "Ma", "Ju", "Ju", "Ao", "Sep", "Oct", "No", "Dé"],
                                                                                datasets: [
                                                                                          {
                                                                                                    data: affectationsDatas
                                                                                          }
                                                                                ]
                                                                      }}
                                                                      width={screenWidth - 30} // from react-native
                                                                      height={220}
                                                                      yAxisInterval={1} // optional, defaults to 1
                                                                      chartConfig={{...chartConfig, 
                                                                                backgroundGradientFrom: "#2095c1",
                                                                                backgroundGradientTo: "#2095c1",}}
                                                                      bezier
                                                                      style={{
                                                                                marginVertical: 8,
                                                                                borderRadius: 15
                                                                      }}
                                                            />
                                                            <Text style={styles.chartTitle}>Nombre de CRA par mois ({ new Date().getFullYear() })</Text>
                                                            <LineChart
                                                                      data={{
                                                                                labels: ["Ja", "Fé", "Ma", "Ap", "Ma", "Ju", "Ju", "Ao", "Sep", "Oct", "No", "Dé"],
                                                                                datasets: [
                                                                                          {
                                                                                                    data: crasDatas
                                                                                          }
                                                                                ]
                                                                      }}
                                                                      width={screenWidth - 30} // from react-native
                                                                      height={220}
                                                                      yAxisInterval={1} // optional, defaults to 1
                                                                      chartConfig={{...chartConfig, 
                                                                                backgroundGradientFrom: "#2083c1",
                                                                                backgroundGradientTo: "#a085c0",}}
                                                                      bezier
                                                                      style={{
                                                                                marginVertical: 8,
                                                                                borderRadius: 15
                                                                      }}
                                                            />{/* 
                                                            <BarChart
                                                                      data={{
                                                                                labels: ["Ja", "Fé", "Ma", "Ap", "Ma", "Ju", "Ju", "Ao", "Sep", "Oct", "No", "Dé"],
                                                                                datasets: [
                                                                                          {
                                                                                                    data: crasDatas
                                                                                          },
                                                                                ]
                                                                      }}
                                                                      width={screenWidth - 30}
                                                                      height={220}
                                                                      chartConfig={{...chartConfig, 
                                                                                backgroundGradientFrom: "#2095c1",
                                                                                backgroundGradientTo: "#2095c1",}}
                                                                      verticalLabelRotation={30}
                                                                      style={{
                                                                                marginVertical: 8,
                                                                                borderRadius: 16
                                                                      }}
                                                                      showBarTops={true}
                                                            /> */}
                                                            {/* <Text style={styles.chartTitle}>Nombre de CRA par mois</Text>
                                                            <ProgressChart
                                                                      data={{
                                                                                labels: ["Swim", "Bike", "Run"], // optional
                                                                                data: [0.4, 0.6, 0.8]
                                                                      }}
                                                                      width={screenWidth - 30}
                                                                      height={220}
                                                                      strokeWidth={16}
                                                                      radius={32}
                                                                      chartConfig={{...chartConfig, 
                                                                                backgroundGradientFrom: "#2083c1",
                                                                                backgroundGradientTo: "#a085c0",}}
                                                                      hideLegend={false}
                                                                      style={{
                                                                                marginVertical: 8,
                                                                                borderRadius: 16
                                                                      }}
                                                            /> */}
                                                  </View>
                                        </View>
                              </ScrollView>
                    </View>
          )
}