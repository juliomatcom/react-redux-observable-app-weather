import React from 'react';

export default function NoMatch(props) {
  return (
    <div>
      <h3>
        No match for <code>{props.location.pathname}</code>
      </h3>
    </div>
  );
}
