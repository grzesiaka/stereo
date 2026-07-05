// oxlint-disable no-undef

const perfObserver: PerformanceObserverCallback = (list, _observer) => {
  list.getEntries().forEach((entry) => {
    if (entry.entryType === "resource") {
      console.log(entry.name);

      return;
    }
    console.log(entry.entryType, entry.type, entry);
    if (entry.entryType === "mark") {
      console.log(`${entry.name}'s startTime: ${entry.startTime}`);
    }
    if (entry.entryType === "measure") {
      console.log(`${entry.name}'s duration: ${entry.duration}`);
    }
  });
};
const observer = new PerformanceObserver(perfObserver);
observer.observe({
  entryTypes: [...PerformanceObserver.supportedEntryTypes],
});
