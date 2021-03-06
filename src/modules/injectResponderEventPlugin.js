// based on https://github.com/facebook/react/pull/4303/files

import EventPluginRegistry from 'react-dom/lib/EventPluginRegistry';
import normalizeNativeEvent from './normalizeNativeEvent';
import ResponderEventPlugin from 'react-dom/lib/ResponderEventPlugin';
import ResponderTouchHistoryStore from 'react-dom/lib/ResponderTouchHistoryStore';

const topMouseDown = 'topMouseDown';
const topMouseMove = 'topMouseMove';
const topMouseUp = 'topMouseUp';
const topScroll = 'topScroll';
const topSelectionChange = 'topSelectionChange';
const topTouchCancel = 'topTouchCancel';
const topTouchEnd = 'topTouchEnd';
const topTouchMove = 'topTouchMove';
const topTouchStart = 'topTouchStart';

const endDependencies = [ topTouchCancel, topTouchEnd, topMouseUp ];
const moveDependencies = [ topTouchMove, topMouseMove ];
const startDependencies = [ topTouchStart, topMouseDown ];

/**
 * Setup ResponderEventPlugin dependencies
 */
ResponderEventPlugin.eventTypes.responderMove.dependencies = moveDependencies;
ResponderEventPlugin.eventTypes.responderEnd.dependencies = endDependencies;
ResponderEventPlugin.eventTypes.responderStart.dependencies = startDependencies;
ResponderEventPlugin.eventTypes.responderRelease.dependencies = endDependencies;
ResponderEventPlugin.eventTypes.responderTerminationRequest.dependencies = [];
ResponderEventPlugin.eventTypes.responderGrant.dependencies = [];
ResponderEventPlugin.eventTypes.responderReject.dependencies = [];
ResponderEventPlugin.eventTypes.responderTerminate.dependencies = [];
ResponderEventPlugin.eventTypes.moveShouldSetResponder.dependencies = moveDependencies;
ResponderEventPlugin.eventTypes.selectionChangeShouldSetResponder.dependencies = [ topSelectionChange ];
ResponderEventPlugin.eventTypes.scrollShouldSetResponder.dependencies = [ topScroll ];
ResponderEventPlugin.eventTypes.startShouldSetResponder.dependencies = startDependencies;

const originalRecordTouchTrack = ResponderTouchHistoryStore.recordTouchTrack;

ResponderTouchHistoryStore.recordTouchTrack = (topLevelType, nativeEvent) => {
  // Filter out mouse-move events when the mouse button is not down
  if ((topLevelType === topMouseMove) && !ResponderTouchHistoryStore.touchHistory.touchBank.length) {
    return;
  }

  const normalizedEvent = normalizeNativeEvent(nativeEvent);
  originalRecordTouchTrack.call(ResponderTouchHistoryStore, topLevelType, normalizedEvent);
};

EventPluginRegistry.injectEventPluginsByName({
  ResponderEventPlugin
});
