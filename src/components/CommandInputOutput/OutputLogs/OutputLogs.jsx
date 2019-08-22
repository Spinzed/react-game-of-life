import React from "react";
import styles from "./styles.module.css";
import { useSelector } from "react-redux";

const OutputLogs = () => {
  const history = useSelector(state => state.outputLogHistory);
  const logsDiv = React.useRef();
  React.useEffect(() => {
    logsDiv.current.scrollTop = logsDiv.current.scrollHeight;
  });

  return (
    <div ref={logsDiv} className={styles.OutputLogs}>
      <ul>
        {history.map(
          (element, i) =>
            history.length - i <= 30 && (
              <li key={element.id} className={styles.OutputLogsFragment}>
                <p>{element.message}</p>
              </li>
            )
        )}
      </ul>
    </div>
  );
};

export default OutputLogs;
