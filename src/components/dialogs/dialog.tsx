import React, { useMemo } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { Card, Text, Modal } from '@ui-kitten/components';

type FooterContainerProps = ViewProps & {
    children?: React.ReactNode
}

export type DialogProps = ViewProps & {
    buttons?: React.ReactNode;
    status?: string;
    title: string;
    text: string;
    onBackdropPress: () => void;
};

const Header = (props?:ViewProps, title?:string):React.ReactElement => (
    <View {...props} style={[props?.style, styles.headerContainer]}>
        <Text category='h6'>{title}</Text>
    </View>
);

const FooterContainer:React.FC<FooterContainerProps> = (props?:FooterContainerProps) => (
    <View {...props} style={[props?.style, styles.footerContainer]}>
        {props?.children}
    </View>
);

export const Dialog:React.FC<DialogProps> = (props:DialogProps) => {

    const Footer = useMemo( () => (footerProps?:ViewProps) => (
        <FooterContainer {...footerProps}>
            {props.buttons}
        </FooterContainer>
    ), [props.buttons]);

    return useMemo( () =>(
        <Modal
            style={styles.modal}
            visible={true}
            backdropStyle={styles.backdrop}
            onBackdropPress={() => props.onBackdropPress()}>
            <Card disabled={true} appearance='filled' status={props.status} header={(headerProps?:ViewProps) => Header(props, props.title)} footer={Footer}>
                <Text category='c1'>{props.text}</Text>
            </Card>
        </Modal>
    ), [props])
};
  
const styles = StyleSheet.create({
    modal: {
        paddingHorizontal: 30
    }, 
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        margin: 15
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'center'
    }
});
  