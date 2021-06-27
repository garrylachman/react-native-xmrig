import React from 'react';
import { StyleSheet, ViewProps, View } from 'react-native';
import { Text, Card, CardProps, Icon, IconProps } from '@ui-kitten/components';
import { ISettings, ISettingsReducerAction } from '../../../core/settings';

export type SettingsCardProps = CardProps & {
    settings: ISettings;
    settingsDispatcher: React.Dispatch<ISettingsReducerAction>;
    title: string;
    showContent?: boolean;
    icon: string;
};

type SettingsCardHeaderProps = ViewProps & {
    text: string;
    icon: string;
    isMutted: boolean;
};

const CardHeader = ({isMutted, icon, ...props}:SettingsCardHeaderProps):React.ReactElement<SettingsCardHeaderProps> => {
    const iconRef = React.useRef<IconProps>();

    React.useEffect(() => {
        if (isMutted) { iconRef.current.startAnimation() }
    }, [isMutted])

    return React.useMemo( () => (
        <View {...props} style={[styles.cardHeader, ...[isMutted ? styles.cardHeaderMutted : {}]]}>
            <Text category={isMutted ? 's1' : 'h6'} appearance={isMutted ? 'hint' : 'default'}>{props.text}</Text>
            <Icon name={icon} fill='#8F9BB3' style={styles.icon} animation='zoom' ref={iconRef} />
        </View>), [isMutted]);
   
};

export const SettingsCard:React.FC<SettingsCardProps> = ({title, icon, style, children, showContent=true, ...props}) => React.useMemo( () => (
    <Card {...props} style={[styles.card, style]} header={headerProps => CardHeader({...headerProps, text: title, icon: icon, isMutted: !showContent})}>
        {showContent && children}
        {!showContent && <Text category='c1'>Click to show content</Text>}
    </Card>), [title, icon, style, children, showContent,props]);

const styles = StyleSheet.create({
    card: {
        //marginTop: 15
    },
    cardHeader: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 25,
        paddingVertical: 8
    },
    cardHeaderMutted: {
        paddingVertical: 3
    },
    icon: {
        width: 25,
        height: 25
    }
});