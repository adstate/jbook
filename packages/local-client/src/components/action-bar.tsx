import './action-bar.css';
import { useActions } from '../hooks/use-actions';
import ActionButton from './action-button';

interface ActionBarProps {
  id: string;
}

const ActionBar: React.FC<ActionBarProps> = ({ id }) => {
  const { moveCell, deleteCell } = useActions();

  return (
    <div className="action-bar">
      <ActionButton
        iconClass="fa-arrow-up"
        onClick={() => {
          moveCell(id, 'up');
        }}
      />

      <ActionButton
        iconClass="fa-arrow-down"
        onClick={() => moveCell(id, 'down')}
      />

      <ActionButton iconClass="fa-times" onClick={() => deleteCell(id)} />
    </div>
  );
};

export default ActionBar;
