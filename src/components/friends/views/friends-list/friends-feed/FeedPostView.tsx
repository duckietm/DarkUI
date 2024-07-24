import { useEffect, useRef, useState } from 'react';
import { timeSince } from '../../../../../api/utils/Time';
import { Text } from '../../../../../common';
interface FeedPostProps
{
    post: any;
    userId: number;
    like: any;
    comment: any;
    commentLike: any;
}

const FeedPostView = (props: FeedPostProps) =>
{
    const [commentsVisible, setCommentsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const [ message, setMessage ] = useState("");
    
    useEffect(() =>
    {
        if (commentsVisible)
        {
            if (ref.current)
            {
                const lastItem = ref.current.lastElementChild;
                if (lastItem)
                {
                    ref.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
                }
            }
        }
    }, [commentsVisible]);

    return (
        <div ref={ref} className="mt-2">
            <div className='card bg-dark text-white'>
                <div className='card-body'>
                    <div className='row'>
                        <div className='col-md-2 gx-5'>
                            <div className='nitro-chat-avatar-card-feed'>
                                <img className="nitro-chat-avatar-image-feed" src={`https://imager.bobba.chat/?figure=${props.post.user.figure}&direction=4&head_direction=4&headonly=1`} />
                            </div>
                        </div>
                        <div className='col-md-8'>
                            <div>
                                <Text variant="white" bold fontSize={6}>{props.post.user.username}</Text><br />
                                <span className='badge bg-muted text-dark'>Hace {timeSince(props.post.date)}</span>
                            </div>
                        </div>
                        <div className='col-md-2'>
                            {props.userId === props.post.user.id ?
                                <button className='btn btn-danger btn-small' style={{ fontSize: "12px", marginLeft: "-23px", marginTop: "9px" }}>Borrar</button> : <button className='btn btn-danger btn-small' style={{ fontSize: "12px", marginLeft: "-23px", marginTop: "9px" }}>Reportar</button>}
                        </div>
                        <div className="col-md-12 mt-3">
                            <Text variant='white'>{props.post.content}</Text>
                            {props.post.photo !== null && props.post.photo !== undefined &&
                                <center>
                                    {props.post.photo}
                                    <img style={{ width: "200px" }} className="mt-2" src={props.post.photo} />
                                </center>
                            }
                        </div>
                        <div className='col-md-12 mt-2'>
                            <Text variant="muted" small>
                                <i className="fas fa-thumbs-up"></i> Esta publicación ha recibido {props.post.likes.length} likes.
                                {props.post.likes.length > 0 &&
                                    <> Entre ellos:
                                        {props.post.likes.slice(0, 3).map((like) =>
                                            <> {like.user.username},</>
                                        )}
                                    </>
                                }
                            </Text>
                        </div>
                    </div>
                </div>
            </div>
            <div className='row gx-1'>
                <div className='col-md-6'>
                    <button onClick={() => props.like(props.post.id)} className={`btn ${props.post.likes.filter(obj => obj.user.id === props.userId).length > 0 ? 'btn-danger' : 'btn-muted'} w-100 btn-sm`} style={{ borderRadius: "0px" }}>{props.post.likes.filter(obj => obj.user.id === props.userId).length > 0 ? 'Ya no me gusta' : 'Me gusta'}</button>
                </div>
                <div className='col-md-6'>
                    <button onClick={() => setCommentsVisible(prevValue => !prevValue)} className="btn btn-muted w-100 btn-sm" style={{ borderRadius: "0px" }}>{commentsVisible ? "Ocultar comentarios" : "Mostrar comentarios"}</button>
                </div>
            </div>
            {commentsVisible &&
                <div className='card bg-muted mt-2 mb-1'>
                    <div className='card-body'>
                        {props.post.comments.length > 0 && props.post.comments.map((comment, index) =>
                            <div className='row' key={index}>
                                <div className='col-md-2'>
                                    <div className='nitro-chat-avatar-card-feed'>
                                        <img className="nitro-chat-avatar-image-feed-comment" src={`https://imager.bobba.chat/?figure=${comment.user.figure}&direction=4&head_direction=4&headonly=1`} />
                                    </div>
                                </div>
                                <div className='col-md-10'>
                                    <div className="d-flex justify-content-between">
                                        <div>
                                            <Text variant='black' bold>{comment.user.username}</Text>
                                        </div>
                                        <div>
                                            <span className='badge bg-dark' style={{ fontSize: "11px" }}>{comment.likes.length} likes</span>&nbsp;
                                            <span onClick={() => props.commentLike(props.post.id, comment.id)} className={`badge ${comment.likes.filter(obj => obj.user.id === props.userId).length > 0 ? 'bg-danger' : 'bg-dark'}`} style={{ fontSize: "11px", cursor: "pointer" }}>{comment.likes.filter(obj => obj.user.id === props.userId).length > 0 ? 'Ya no me gusta' : 'Me gusta'}</span>
                                        </div>
                                    </div>
                                    <div className='mt-1'>
                                        <Text variant="black">{comment.content}</Text>
                                    </div>
                                </div>
                                <div className="col-md-12 mt-1">
                                    <hr />
                                </div>
                            </div>
                        )}
                        <div className='w-100'>
                            <textarea className='form-control' value={message} onChange={(e) => setMessage(e.target.value)} >

                            </textarea>
                            <button className='btn btn-dark w-100 btn-sm mt-2' onClick={() => { props.comment(props.post.id, message); setMessage("") }}>Publicar comentario</button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default FeedPostView
