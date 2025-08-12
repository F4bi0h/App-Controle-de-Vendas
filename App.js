import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider, MD3DarkTheme as PaperDarkTheme } from 'react-native-paper';

import HomeScreen from './screens/HomeScreen';
import ProdutosScreen from './screens/ProdutosScreen';
import PedidosScreen from './screens/PedidoScreen';
import RelatorioScreen from './screens/RelatorioScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider theme={PaperDarkTheme}>
      <NavigationContainer theme={DarkTheme}>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Início' }} />
          <Stack.Screen name="Produtos" component={ProdutosScreen} />
          <Stack.Screen name="Pedidos" component={PedidosScreen} />
          <Stack.Screen name="Relatorio" component={RelatorioScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
