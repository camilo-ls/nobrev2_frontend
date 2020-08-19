import React from 'react'
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer'

const PdfDocument = (props) => {
    console.log('pdf',props.data)
    return (
        <Document>
            <Page size='A4'>
                {props.data ? props.data.map((proc) => {
                    return (
                        <View key={proc.cod}>
                            <Text>{proc.cod}</Text>
                            <Text>{proc.nome}</Text>
                            <Text>{proc.quantidade}</Text>
                        </View>
                    )
                }):null}
            </Page>
        </Document>
    )
}

export default PdfDocument