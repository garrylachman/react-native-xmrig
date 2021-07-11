import React from 'react';
import { Layout, Spinner, Text } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import Shimmer from 'react-native-shimmer';

export const Lazy = (componentImportFn:Function) => React.lazy(async () => {
    let obj = await componentImportFn()
    return typeof obj.default === 'function' ? obj : obj.default
})

export const SpinnerLayout = () => (
    <Layout style={styles.spinnerContainer} level='2'>
        <Spinner status='success' size='giant'/>
        <Shimmer>      
            <Text category="h3">Loading</Text>
        </Shimmer>
    </Layout>
)

export const LazyLoader:React.FC = ({children}) => (
    <React.Suspense fallback={<SpinnerLayout />}>
        {children}
    </React.Suspense>
)

const styles = StyleSheet.create({
    spinnerContainer: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      flex: 1,
      flexWrap: 'wrap',
    },
});