/* eslint-disable jsx-a11y/anchor-is-valid */
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Loading from '../../../components/Loading';
import Meta from '../../../components/Meta';

export default function TodoEdit({ data, todoId }) {
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [todo, setTodo] = useState({
        title: '',
        note: '',
        comment: '',
    });

    useEffect(() => {
        if (data.data) {
            setTodo({
                title: data.data.title,
                note: data.data.note,
                comment: data.data.comment ? data.data.comment : '',
            });
        } else {
            toast.error('Something went wrong!');
        }
        setLoading(false);
    }, [data.data]);

    const handleInput = (e) => {
        const inputName = e.target.name;
        const inputValue = e.target.value;
        setTodo({
            ...todo,
            [inputName]: inputValue,
        });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        if (loading) return true;

        setLoading(true);
        setErrors({});

        // eslint-disable-next-line no-shadow
        const data = JSON.stringify({
            title: todo.title,
            note: todo.note,
            comment: todo.comment,
        });

        // request handle with javascrpt fetch
        fetch(`${process.env.API_URL}/todos/${todoId}`, {
            method: 'put',
            body: data,
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((response) => response.json())
            .then((response) => {
                if (response.errors) {
                    setErrors(response.errors);
                } else {
                    toast.success('Todo Updated!');
                }
                setLoading(false);
            })
            .catch(() => {
                toast.success('Something went wrong!');
                setLoading(false);
            });

        return true;
    };

    return (
        <>
            <Meta title="Create Todo" />
            <Loading show={loading} />
            <div className="container my-3">
                <Card>
                    <Card.Header>
                        <span className="h4 me-4">Edit Todo</span>
                        <Link href="/todos">
                            <a className="btn btn-sm btn-primary">Todo List</a>
                        </Link>
                    </Card.Header>
                    <Card.Body>
                        <Form onSubmit={handleFormSubmit}>
                            <Form.Group className="mb-3" controlId="title">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    value={todo.title}
                                    onChange={handleInput}
                                />
                                {errors.title && (
                                    <Form.Text className="text-danger">{errors.title}</Form.Text>
                                )}
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="note">
                                <Form.Label>Note</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="note"
                                    value={todo.note}
                                    onChange={handleInput}
                                />
                                {errors.note && (
                                    <Form.Text className="text-danger">{errors.note}</Form.Text>
                                )}
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="comment">
                                <Form.Label>Comment</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="comment"
                                    value={todo.comment}
                                    onChange={handleInput}
                                />
                                {errors.comment && (
                                    <Form.Text className="text-danger">{errors.comment}</Form.Text>
                                )}
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                Save
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </>
    );
}

export async function getServerSideProps(context) {
    const { todoId } = context.params;
    // get todo with js fetch
    const res = await fetch(`${process.env.API_URL}/todos/${todoId}`, {
        method: 'get',
    });

    const data = await res.json();

    return {
        props: { data, todoId },
    };
}
