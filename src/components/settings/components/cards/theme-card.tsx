import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, IconProps, IndexPath, Layout, Select, SelectItem, Text } from '@ui-kitten/components';
import { SettingsCard, SettingsCardProps } from '../settings.card';
import { SettingsActionType, Themes } from '../../../../core/settings';

const ForwardIcon = (props:IconProps) => (
    <Icon {...props} name='arrow-ios-forward'/>
  );

const themes:string[] = [
    Themes.LIGHT,
    Themes.DARK
]

export const ThemeCard:React.FC<SettingsCardProps> = ({settings, settingsDispatcher,  ...props}) => {

    const [selectedIndex, setSelectedIndex] = React.useState<IndexPath>(settings.theme ? new IndexPath(themes.indexOf(settings.theme)) : new IndexPath(0));

    React.useEffect(() => {
        settingsDispatcher({
            type: SettingsActionType.SET_THEME,
            value: themes[selectedIndex.row]
        })
    }, [selectedIndex]);
    
    return (
        <>
            <SettingsCard {...props} settings={settings} settingsDispatcher={settingsDispatcher} status="primary">
                <Select
                    label='Theme'
                    value={themes[selectedIndex.row]}
                    selectedIndex={selectedIndex}
                    onSelect={indexPath => setSelectedIndex(indexPath as IndexPath)}>
                    {themes.map((value, index) => (
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