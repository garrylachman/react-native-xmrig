import React, { useMemo, useRef, useEffect } from 'react';
import { StyleSheet, ViewProps, View } from 'react-native';
import { Text, Card, CardProps, Icon, IconProps } from '@ui-kitten/components';
import { ISettings, ISettingsReducerAction } from '../../../core/settings';
import { IconAnimation } from '@ui-kitten/components/ui/icon/iconAnimation';

export type SettingsCardProps = CardProps & {
    settings: ISettings;
    settingsDispatcher: React.Dispatch<ISettingsReducerAction>;
    title: string;
    showContent: boolean;
    icon: string;
};

type SettingsCardHeaderProps = ViewProps & {
    text: string;
    icon: string;
    isMutted: boolean;
};

const CardHeader = (props:SettingsCardHeaderProps):React.ReactElement<SettingsCardHeaderProps> => {
    const iconRef = useRef<IconProps>();

    useEffect(() => {
        if (props.isMutted) { iconRef.current.startAnimation() }
    }, [props.isMutted])

    return useMemo( () => (
        <View {...props} style={[styles.cardHeader, ...[props.isMutted ? styles.cardHeaderMutted : {}]]}>
            <Text category={props.isMutted ? 's1' : 'h6'} appearance={props.isMutted ? 'hint' : 'default'}>{props.text}</Text>
            <Icon name={props.icon} fill='#8F9BB3' style={styles.icon} animation='zoom' ref={iconRef} />
        </View>), [props.isMutted]);
   
};

export const SettingsCard:React.FC<SettingsCardProps> = (props:SettingsCardProps) => useMemo( () => (
    <Card {...props} style={[styles.card, props.style]} header={headerProps => CardHeader({...headerProps, text: props.title, icon: props.icon, isMutted: !props.showContent})}>
        {props.showContent && props.children}
        {!props.showContent && <Text category='c1'>Click to show content</Text>}
    </Card>), [props]);

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