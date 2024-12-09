import React from 'react';
import { Button, ButtonGroup } from '@mui/material';

interface CommentActionsProps {
    onEdit: () => void;
    onDelete: () => void;
    onCreatePost: () => void; // Added new property
}

const CommentActions: React.FC<CommentActionsProps> = ({ onEdit, onDelete, onCreatePost }) => {
    return (
        <ButtonGroup variant="contained" color="primary">
            <Button onClick={onEdit}>Edit</Button>
            <Button onClick={onDelete}>Delete</Button>
            <Button onClick={onCreatePost}>Create Post</Button> {/* Added new button */}
        </ButtonGroup>
    );
};

export default CommentActions;