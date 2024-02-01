import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPostById } from '../lib/apiWrapper';
import { CategoryType, PostFormDataType, UserType } from '../types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';


type EditPostProps = {
    currentUser: UserType|null,
    flashMessage: (message:string, category:CategoryType) => void
}

export default function EditPost({ currentUser, flashMessage }: EditPostProps) {
    const { postId } = useParams();
    const navigate = useNavigate();

    const [postToEditData, setPostToEditData] = useState<PostFormDataType>({title:'', body:''})
    
    useEffect( () => {
        async function getPost(){
            let response = await getPostById(postId!);
            if (response.error){
                flashMessage(response.error, 'danger');
            } else if (response.data) {
                const postToEdit = response.data
                if (postToEdit.userId !== currentUser?.id){
                    flashMessage('You do not have permission to edit this post', 'danger');
                    navigate('/')
                } else {
                    setPostToEditData({ title: postToEdit.title, body: postToEdit.body})
                }
            }
        }
        getPost();
    }, [ postId ] );

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPostToEditData({...postToEditData, [event.target.name]: event.target.value})
    }


    return (
        <>
            <h1 className="text-center">Edit Post</h1>
            <Card>
                <Card.Body>
                    <Form>
                        <Form.Label>Title</Form.Label>
                        <Form.Control name='title' value={postToEditData.title} onChange={handleInputChange} />
                        <Form.Label>Body</Form.Label>
                        <Form.Control name='body' value={postToEditData.body} onChange={handleInputChange} />
                        <Button variant='success' className='mt-3 w-50' type='submit'>Edit Post</Button>
                        <Button variant='danger' className='mt-3 w-50' >Delete Post</Button>
                    </Form>
                </Card.Body>
            </Card>
        </>
    )
}