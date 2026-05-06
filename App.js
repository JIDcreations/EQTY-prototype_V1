import 'react-native-gesture-handler';
import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import { CommonActions, DefaultTheme, NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors, typography, useTheme } from './theme';
import { AppProvider, useApp } from './utils/AppContext';
import { GlossaryProvider } from './components/GlossaryProvider';
import AppTabBar from './components/AppTabBar';
import HomeScreen from './screens/HomeScreen';
import GlossaryScreen from './screens/GlossaryScreen';
import ProfileStack from './navigation/ProfileStack';
import OnboardingStack from './navigation/OnboardingStack';
import GlossaryDetailScreen from './screens/GlossaryDetailScreen';
import OnboardingQuestionScreen from './screens/onboarding/OnboardingQuestionScreen';
import LessonsStack from './navigation/LessonsStack';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function Tabs() {
  const { colors, typography, components, mode } = useTheme();
  const isLight = mode === 'light';

  return (
    <Tab.Navigator
      tabBar={(props) => <AppTabBar {...props} />}
      screenOptions={({ route }) => {
        const focusedRouteName = getFocusedRouteNameFromRoute(route) ?? 'LessonsHome';
        const suppressLessonsSelection =
          route.name === 'Lessons' &&
          (focusedRouteName === 'LessonResources' || focusedRouteName === 'LessonVideos');
        const activeTintColor = suppressLessonsSelection
          ? colors.text.secondary
          : isLight
            ? colors.text.primary
            : colors.accent.primary;

        return {
          headerShown: false,
          tabBarActiveTintColor: activeTintColor,
          tabBarInactiveTintColor: colors.text.secondary,
          tabBarShowLabel: false,
          tabBarItemStyle: {
            borderRadius: components.radius.pill,
          },
          tabBarIcon: ({ color, size, focused }) => {
            const isActive = focused && !suppressLessonsSelection;
            let iconName = 'home-outline';
            if (route.name === 'Home') iconName = isActive ? 'home' : 'home-outline';
            if (route.name === 'Lessons') iconName = isActive ? 'book' : 'book-outline';
            if (route.name === 'Glossary') iconName = isActive ? 'list' : 'list-outline';
            if (route.name === 'Profile') iconName = isActive ? 'person' : 'person-outline';
            return (
              <View style={{ alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <Ionicons name={iconName} size={size} color={color} />
                <Text style={{ ...typography.styles.meta, fontSize: 12, color }}>
                  {route.name}
                </Text>
              </View>
            );
          },
        };
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Lessons"
        component={LessonsStack}
        listeners={({ navigation, route }) => ({
          tabPress: (event) => {
            const tabState = navigation.getState();
            const activeRouteKey = tabState.routes[tabState.index]?.key;
            const isFocusedTab = activeRouteKey === route.key;
            const nestedStackKey = route.state?.key;

            const resetLessonsStack = () => {
              if (!nestedStackKey) return false;
              navigation.dispatch({
                ...CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'LessonsHome' }],
                }),
                target: nestedStackKey,
              });
              return true;
            };

            event.preventDefault();
            if (isFocusedTab) {
              if (resetLessonsStack()) return;
              navigation.navigate('Lessons', { screen: 'LessonsHome' });
              return;
            }

            resetLessonsStack();
            navigation.navigate('Lessons');
          },
        })}
      />
      <Tab.Screen name="Glossary" component={GlossaryScreen} />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarButton: () => null,
          tabBarItemStyle: { display: 'none' },
        }}
      />
    </Tab.Navigator>
  );
}

function RootStack() {
  const { isReady, authUser, preferences } = useApp();
  const { colors } = useTheme();

  if (!isReady) {
    return <View style={{ flex: 1, backgroundColor: colors.background.app }} />;
  }

  const showOnboarding = !preferences?.hasOnboarded || !authUser;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {showOnboarding ? (
        <Stack.Screen name="Onboarding" component={OnboardingStack} />
      ) : (
        <>
          <Stack.Screen name="Tabs" component={Tabs} />
          <Stack.Screen
            name="OnboardingQuestionExperience"
            component={OnboardingQuestionScreen}
            initialParams={{
              question: 'What have you already done in terms of investing?',
              field: 'experienceAnswer',
              step: 1,
              total: 3,
              nextRoute: 'OnboardingQuestionKnowledge',
            }}
          />
          <Stack.Screen
            name="OnboardingQuestionKnowledge"
            component={OnboardingQuestionScreen}
            initialParams={{
              question: 'What do you already know about investing today?',
              field: 'knowledgeAnswer',
              step: 2,
              total: 3,
              nextRoute: 'OnboardingQuestionMotivation',
            }}
          />
          <Stack.Screen
            name="OnboardingQuestionMotivation"
            component={OnboardingQuestionScreen}
            initialParams={{
              question: 'Why do you want to start investing?',
              field: 'motivationAnswer',
              step: 3,
              total: 3,
              isLast: true,
            }}
          />
          <Stack.Screen name="GlossaryDetail" component={GlossaryDetailScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

function AppShell() {
  const { preferences } = useApp();
  const { colors } = useTheme();
  const isLight = preferences?.appearance === 'Light';
  const navTheme = useMemo(
    () => ({
      ...DefaultTheme,
      dark: !isLight,
      colors: {
        ...DefaultTheme.colors,
        background: colors.background.app,
        card: colors.background.surface,
        text: colors.text.primary,
        border: colors.ui.divider,
        primary: colors.accent.primary,
      },
    }),
    [colors, isLight]
  );

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background.app }}>
      <SafeAreaProvider>
        <GlossaryProvider>
          <NavigationContainer theme={navTheme}>
            <StatusBar style={isLight ? 'dark' : 'light'} />
            <RootStack />
          </NavigationContainer>
        </GlossaryProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    'Inter-Regular': require('./assets/fonts/Inter,Playfair_Display,Poppins,Zeyada/Inter/static/Inter_24pt-Regular.ttf'),
    'Inter-Medium': require('./assets/fonts/Inter,Playfair_Display,Poppins,Zeyada/Inter/static/Inter_24pt-Medium.ttf'),
    'Inter-SemiBold': require('./assets/fonts/Inter,Playfair_Display,Poppins,Zeyada/Inter/static/Inter_24pt-SemiBold.ttf'),
    'FilsonPro-Bold': require('./assets/fonts/filson-pro/FilsonProBold.otf'),
  });

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: colors.dark.background.app }} />;
  }

  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
