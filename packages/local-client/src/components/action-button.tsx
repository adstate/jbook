interface ActionButtonProps {
  iconClass: string;
  rounded?: boolean;
  onClick: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  iconClass,
  rounded,
  onClick,
  children,
}) => {
  const iconClasses = `fas ${iconClass}`;
  const buttonClasses = `button is-primary is-small ${
    rounded ? 'is-rounded' : ''
  }`;

  return (
    <button className={buttonClasses} onClick={onClick}>
      <span className="icon">
        <i className={iconClasses}></i>
      </span>
      {children && <span>{children}</span>}
    </button>
  );
};

export default ActionButton;
