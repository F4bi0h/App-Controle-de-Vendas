import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20, gap: 16 }}>
      <Text variant="titleLarge" style={{ textAlign: 'center', marginBottom: 20 }}>
        Controle de Vendas
      </Text>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('Produtos')}
      >
        Gerenciar Produtos
      </Button>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('Pedidos')}
      >
        Gerenciar Pedidos
      </Button>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('Relatorio')}
      >
        Ver Relatório
      </Button>
    </View>
  );
}
