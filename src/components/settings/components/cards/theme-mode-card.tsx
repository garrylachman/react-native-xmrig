import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, IconProps, IndexPath, Layout, Select, SelectItem, Text } from '@ui-kitten/components';
import { SettingsCard, SettingsCardProps } from '../settings.card';
import { SettingsActionType } from '../../../../core/settings';
import { ThemeModes } from '../../../../core/settings';

const ForwardIcon = (props:IconProps) => (
    <Icon {...props} name='arrow-ios-forward'/>
  );

const themeModes:string[] = Object.values(ThemeModes);

export const ThemeModeCard:React.FC<SettingsCardProps> = ({settings, settingsDispatcher,  ...props}) => {

    const [selectedIndex, setSelectedIndex] = React.useState<IndexPath>(settings.theme_mode ? new IndexPath(themeModes.indexOf(settings.theme_mode)) : new IndexPath(0));

    React.useEffect(() => {
        settingsDispatcher({
            type: SettingsActionType.SET_THEME_MODE,
            value: themeModes[selectedIndex.row]
        })
    }, [selectedIndex]);
    
    return (
        <>
            <SettingsCard {...props} settings={settings} settingsDispatcher={settingsDispatcher} status="primary">
                <Text appearance='hint' category="c1" style={styles.text}>
                    There are two User Interface modes: 
                    "Advanced" - A full feature elegant UI, the main focus is data over design. 
                    "Simple Young" - A Simple fresh UI, the main focus is design over data</Text>
                <Select
                    label='Theme Mode'
                    value={themeModes[selectedIndex.row]}
                    selectedIndex={selectedIndex}
                    onSelect={indexPath => setSelectedIndex(indexPath as IndexPath)}>
                    {themeModes.map((value, index) => (
                        <SelectItem key={`key-${index}`} title={value} accessoryRight={ForwardIcon}></SelectItem>
                    ))}
                </Select>
            </SettingsCard>
        </>
    );
}

const styles = StyleSheet.create({
    input: {
        overflow: 'hidden'
    },
    text: {
        paddingBottom: 10,
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