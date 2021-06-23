import React from 'react';
import { NativeModules, StyleSheet, View } from 'react-native';
import { Text, Icon, IconProps, Button } from '@ui-kitten/components';
import { SettingsCard, SettingsCardProps } from '../settings.card';

const { XMRigModule } = NativeModules;


const ShieldIcon = (props:IconProps):React.ReactElement<IconProps> => (
    <Icon {...props} name='shield'/>
);

const ShieldOffIcon = (props:IconProps):React.ReactElement<IconProps> => (
    <Icon {...props} name='shield-off'/>
);

export const BootloaderCard:React.FC<SettingsCardProps> = (props:SettingsCardProps) => {
    
    return (
        <>
            <SettingsCard {...props} status="primary">
                <Text category="c1" style={{paddingBottom: 10}}>Boot miner at startup and keep running as background service.</Text>
                <View style={styles.buttonsRow}>
                    <Button 
                        style={styles.button} 
                        status='primary' 
                        size="tiny" 
                        accessoryLeft={ShieldIcon} 
                        onPress={() => {
                            XMRigModule.EnableBootService();
                        }}
                    >Turn On</Button>
                    <Button 
                        style={styles.button} 
                        status="danger" 
                        size="tiny" 
                        accessoryLeft={ShieldIcon} 
                        onPress={() => {
                            XMRigModule.DisableBootService();
                        }}
                    >Turn Of</Button>
                </View>
            </SettingsCard>
        </>
    );
}

const styles = StyleSheet.create({
    input: {
        overflow: 'hidden'
    },
    captionContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5
    },
    button: {
        margin: 2
    },
    buttonsRow: {
        flexDirection:'row',
        justifyContent: 'space-between'
    }
});