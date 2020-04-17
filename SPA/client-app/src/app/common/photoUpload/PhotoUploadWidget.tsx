import React, { Fragment, useState, useEffect } from 'react'
import { Grid, Header, Image } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import PhotoWidgetDropzone from './PhotoWidgetDropzone';
import PhotoWidgetCropper from './PhotoWidgetCropper';

const PhotoUploadWidget = () => {
    const [files, setFiles] = useState<any>([]);
    const [image, setImage] = useState<Blob | null>(null)

    //Clean widget after in order to avoid memory leak
    useEffect(() => {
        return () => {
            files.forEach((file:any) => URL.revokeObjectURL(file.preview));
        }
    })


    return (
        <Fragment>
            <Grid>
                <Grid.Row />
                <Grid.Column width={4}>
                    <Header color='teal' sub content='Ste 1 - Add Photo'/>
                    <PhotoWidgetDropzone setFiles={setFiles}/>
                </Grid.Column>
                <Grid.Column width={1}></Grid.Column>
                <Grid.Column width={4}>
                    <Header color='teal' sub content='Ste 2 - Resize Image'/>
                    {files.length >0 && 
                        <PhotoWidgetCropper setImage={setImage} imagePreview={files[0].preview}/>
                       
                    }
                    
                </Grid.Column>
                <Grid.Column width={1}></Grid.Column>
                <Grid.Column width={4}>
                    <Header color='teal' sub content='Ste 3 - Preview and Upload'/>
                    {
                        files.length >0 &&  
                            <div className="img-preview" style={{minHeight: '200px', overflow: 'hidden'}}></div>
                    }
                    
                </Grid.Column>
            </Grid>
        </Fragment>
    )
}

export default observer(PhotoUploadWidget);
