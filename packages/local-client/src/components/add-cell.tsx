import { useActions } from '../hooks/use-actions';
import ActionButton from './action-button';
import './add-cell.css';

interface AddCellProps {
  prevCellId: string | null;
  forceVisible?: boolean;
}

const AddCell: React.FC<AddCellProps> = ({ prevCellId, forceVisible }) => {
  const { insertCellAfter } = useActions();

  return (
    <div className={`add-cell ${forceVisible && 'force-visible'}`}>
      <div className="add-buttons">
        <ActionButton
          rounded
          iconClass="fa-plus"
          onClick={() => insertCellAfter(prevCellId, 'code')}
        >
          Code
        </ActionButton>

        <ActionButton
          rounded
          iconClass="fa-plus"
          onClick={() => insertCellAfter(prevCellId, 'text')}
        >
          Text
        </ActionButton>
      </div>
      <div className="divider"></div>
    </div>
  );
};

export default AddCell;
