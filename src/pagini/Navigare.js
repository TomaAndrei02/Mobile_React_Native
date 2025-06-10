import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from "./Home";
import Favorite from "./Favorite";
import Cos from "./Cos";
import News from "./News";
import { Ionicons } from '@expo/vector-icons';
import Librarie from "./Librarie";
import Profil from "./Profil";
import EditProfil from "./EditProfil";
import PaginaJocuri from "./PaginaJocuri";
import Plata from "./Plata";
import JocuriCuparate from "./JocuriCumparate";


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const ProfilNav = ({navigation}) => (
    <Stack.Navigator>
        <Stack.Screen name="ProfilPrincipal" component={Profil} options={{headerShown: false}}/>
        <Stack.Screen name="EditProfil" component={EditProfil} options={{headerShown: true, headerTitle: 'Editarea Profilului'}}/>
        <Stack.Screen name="JocuriCumparate" component={JocuriCuparate} options={{headerShown: true, headerTitle: 'Librăria ta'}}/>
        <Stack.Screen name="PaginaJocuri" component={PaginaJocuri} options={{headerShown: true, headerTitle: ''}}/>
    </Stack.Navigator>
  )

  const JocuriNav = ({navigation}) => (
    <Stack.Navigator>
        <Stack.Screen name="LibrariePrincipala" component={Librarie} options={{headerShown: false}}/>
        <Stack.Screen name="PaginaJocuri" component={PaginaJocuri} options={{headerShown: true, headerTitle: ''}}/>
    </Stack.Navigator>
  )
  const AcasaNav = ({navigation}) => (
    <Stack.Navigator>
        <Stack.Screen name="AcasaPrincipal" component={Home} options={{headerShown: false}}/>
        <Stack.Screen name="PaginaJocuri" component={PaginaJocuri} options={{headerShown: true, headerTitle: ''}}/>
        <Stack.Screen name="LibrariePrincipala" component={Librarie} options={{headerShown: false}}/>
        <Stack.Screen name="ProfilPrincipal" component={Profil} options={{headerShown: false}}/>
    </Stack.Navigator>
  )
  const CosNav = ({navigation}) => (
    <Stack.Navigator>
        <Stack.Screen name="CosPrincipal" component={Cos} options={{headerShown: false}}/>
        <Stack.Screen name="Plata" component={Plata} options={{headerShown: true, headerTitle: 'Plată'}}/>
        <Stack.Screen name="PaginaJocuri" component={PaginaJocuri} options={{headerShown: true, headerTitle: ''}}/>
    </Stack.Navigator>
  )
  const FavoriteNav = ({navigation}) => (
    <Stack.Navigator>
        <Stack.Screen name="FavoritePrincipal" component={Favorite} options={{headerShown: false}}/>
        <Stack.Screen name="PaginaJocuri" component={PaginaJocuri} options={{headerShown: true, headerTitle: ''}}/>
    </Stack.Navigator>
  )

function TabGroup() {
    return (
        <Tab.Navigator 
        screenOptions={({route,navigation}) => ({
            tabBarIcon: ({color, focused, size}) => {
                let iconName;
                if(route.name === "Acasă"){
                    iconName = focused ? "home" : "home-outline";
                }
                else if (route.name === "Favorite"){
                    iconName = focused ? "heart" : "heart-outline";
                }
                else if (route.name === "Coș"){
                    iconName = focused ? "cart" : "cart-outline";
                }
                else if (route.name === "Noutăți"){
                    iconName = focused ? "newspaper" : "newspaper-outline";
                }
                else if (route.name === "Profil"){
                    iconName = focused ? "person-circle" : "person-circle-outline";
                }
                else if (route.name === "Librarie"){
                    iconName = focused ? "list-circle" : "list-circle-outline";
                }
                return <Ionicons name={iconName} size={30} color={color} />
            },
            tabBarActiveTintColor:"white",
            tabBarInactiveTintColor:"white",
            tabBarInactiveBackgroundColor:'#071330',
            tabBarActiveBackgroundColor:'#071330',
            tabBarShowLabel: false,
            
        })}>
            <Tab.Screen name="Acasă" component={AcasaNav} options={{headerShown: false}}/>
            <Tab.Screen name="Favorite" component={FavoriteNav} options={{headerShown: false}}/>
            <Tab.Screen name="Coș" component={CosNav} options={{headerShown: false}}/>
            <Tab.Screen name="Noutăți" component={News} options={{headerShown: false}}/>
            <Tab.Screen name="Librarie" component={JocuriNav} options={{headerShown: false}}/>
            <Tab.Screen name="Profil" component={ProfilNav} options={{headerShown: false}}/>
        </Tab.Navigator>
    )
}

export default function Navigare(){
    return (
    <NavigationContainer independent={true}>
        <TabGroup/>
    </NavigationContainer>
    )
}