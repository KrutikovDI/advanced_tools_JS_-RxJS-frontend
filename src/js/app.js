import { fromEvent } from "rxjs";

import { map } from "rxjs/operators";

const incomingField = document.querySelector(".incoming-field");

function formaiDate(date) {
  const myRe = /(\d{4})-(\d{2})-(\d{2})T(.{5})/;
  const found = date.match(myRe);
  const correctDate = `${found[4]} ${found[3]}.${found[2]}.${found[1]}`;
  return correctDate;
}

const eventSource = new EventSource("http://localhost:6060/messages/unread");

eventSource.addEventListener("open", (e) => {
  console.log(e);
  console.log("sse open");
});

eventSource.addEventListener("error", (e) => {
  console.log(e);
  console.log("sse error");
});

const stream$ = fromEvent(eventSource, "message").pipe(
  map((event) => JSON.parse(event.data).messages[0])
);

stream$.subscribe((value) => {
  console.log(value);
  if (value.subject.length < 16) {
    incomingField.insertAdjacentHTML(
      "afterbegin",
      `<div class="incoming"><div class="email">${
        value.from
      }</div><div class="text">${
        value.subject
      }</div><div class="date">${formaiDate(value.received)}</div></div>`
    );
  } else {
    incomingField.insertAdjacentHTML(
      "afterbegin",
      `<div class="incoming"><div class="email">${
        value.from
      }</div><div class="text">${value.subject.slice(
        0,
        15
      )}...</div><div class="date">${formaiDate(value.received)}</div></div>`
    );
  }
});
