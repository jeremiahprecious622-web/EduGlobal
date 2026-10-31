// ==========================================================
// EduGlobal - classroom.js
// One classroom per subject: daily lessons (with optional YouTube video)
// and a class chat. Used by the student and teacher dashboards.
// Usage: const close = mountRoom(box, { subject, user, profile, moderator, canPostLessons });
// ==========================================================

import { db } from "./firebase-config.js";
import {
  collection, addDoc, deleteDoc, doc, query, orderBy, limit, onSnapshot, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const YT = /^https:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})([&?].*)?$/;
export function youtubeId(url) { const m = YT.exec(url || ""); return m ? m[3] : null; }

const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; };
const when = (ts) => ts ? ts.toDate().toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "sending...";
const ROLE_LABEL = { teacher: "Teacher", superadmin: "Admin" };

export function mountRoom(box, { subject, user, profile, moderator, canPostLessons }) {
  box.innerHTML = "";
  const unsubs = [];
  const lessonsRef = collection(db, "rooms", subject, "lessons");
  const messagesRef = collection(db, "rooms", subject, "messages");
  const note = el("p", "room-note"); note.hidden = true;
  const say = (t) => { note.textContent = t; note.hidden = false; setTimeout(() => { note.hidden = true; }, 5000); };

  box.append(el("h2", "room-title", subject + " classroom"), note);

  // ---------- Lessons ----------
  box.append(el("h3", "section-label", "Daily lessons"));
  if (canPostLessons) {
    const form = el("div", "panel room-form");
    const title = el("input", "dash-input"); title.placeholder = "Lesson title"; title.maxLength = 100;
    const body = el("textarea", "dash-input"); body.placeholder = "Write today's lesson notes, examples or homework"; body.rows = 5; body.maxLength = 4000;
    const video = el("input", "dash-input"); video.placeholder = "YouTube link (optional)"; video.type = "url";
    const post = el("button", "btn btn-primary btn-sm", "Post lesson"); post.type = "button";
    post.addEventListener("click", async () => {
      const t = title.value.trim(), b = body.value.trim(), v = video.value.trim();
      if (t.length < 3) return say("Please add a lesson title.");
      if (b.length < 10) return say("Please write the lesson notes.");
      if (v && !youtubeId(v)) return say("The video must be a YouTube link, for example https://youtu.be/abcdefghijk");
      post.disabled = true;
      try {
        await addDoc(lessonsRef, { title: t, body: b, videoUrl: v, teacherUid: user.uid, teacherName: profile.fullName, createdAt: serverTimestamp() });
        title.value = ""; body.value = ""; video.value = ""; say("Lesson posted.");
      } catch (e) { say("Could not post the lesson. You can only post in subjects assigned to you."); }
      post.disabled = false;
    });
    form.append(title, body, video, post); box.append(form);
  }
  const lessonList = el("div", "lesson-list"); box.append(lessonList);
  unsubs.push(onSnapshot(query(lessonsRef, orderBy("createdAt", "desc"), limit(10)), (snap) => {
    lessonList.innerHTML = "";
    if (snap.empty) { lessonList.append(el("p", "today-note", "No lessons yet. Your teacher will post them here.")); return; }
    snap.docs.forEach((d) => {
      const l = d.data({ serverTimestamps: "estimate" });
      const card = el("div", "item-card lesson-card");
      const head = el("div", "item-head"); const info = el("div");
      info.append(el("h3", "", l.title), el("p", "", l.teacherName + " - " + when(l.createdAt)));
      head.append(info);
      if (moderator) {
        const del = el("button", "btn btn-danger btn-sm", "Delete"); del.type = "button";
        del.addEventListener("click", async () => { if (confirm("Delete this lesson?")) { try { await deleteDoc(d.ref); } catch (e) { say("Could not delete."); } } });
        head.append(del);
      }
      card.append(head, el("p", "lesson-body", l.body));
      const id = youtubeId(l.videoUrl);
      if (id) {
        const wrap = el("div", "video-wrap"); const frame = document.createElement("iframe");
        frame.src = "https://www.youtube-nocookie.com/embed/" + id; frame.loading = "lazy"; frame.title = l.title;
        frame.allow = "accelerometer; encrypted-media; gyroscope; picture-in-picture"; frame.allowFullscreen = true;
        wrap.append(frame); card.append(wrap);
      }
      lessonList.append(card);
    });
  }, () => { lessonList.innerHTML = ""; lessonList.append(el("p", "today-note", "Could not load lessons.")); }));

  // ---------- Chat ----------
  box.append(el("h3", "section-label", "Class chat"));
  box.append(el("p", "chat-rule", "Be kind and keep to the subject. Teachers can remove messages."));
  const list = el("div", "chat-list"); box.append(list);
  unsubs.push(onSnapshot(query(messagesRef, orderBy("createdAt", "desc"), limit(50)), (snap) => {
    list.innerHTML = "";
    if (snap.empty) list.append(el("p", "today-note", "No messages yet. Ask the first question."));
    snap.docs.slice().reverse().forEach((d) => {
      const m = d.data({ serverTimestamps: "estimate" });
      const mine = m.authorUid === user.uid;
      const bubble = el("div", "msg" + (mine ? " mine" : "") + (m.role !== "student" ? " staff" : ""));
      const meta = el("div", "msg-meta");
      meta.append(el("strong", "", m.authorName));
      if (ROLE_LABEL[m.role]) meta.append(el("span", "status", ROLE_LABEL[m.role]));
      meta.append(el("span", "", when(m.createdAt)));
      bubble.append(meta, el("p", "", m.text));
      if (mine || moderator) {
        const del = el("button", "msg-del", "Delete"); del.type = "button";
        del.addEventListener("click", async () => { try { await deleteDoc(d.ref); } catch (e) { say("Could not delete."); } });
        bubble.append(del);
      }
      list.append(bubble);
    });
    list.scrollTop = list.scrollHeight;
  }, () => { list.innerHTML = ""; list.append(el("p", "today-note", "Could not load the chat.")); }));

  const form = el("div", "chat-form");
  const input = el("input", "dash-input"); input.placeholder = "Type a message"; input.maxLength = 500; input.setAttribute("aria-label", "Message");
  const send = el("button", "btn btn-primary btn-sm", "Send"); send.type = "button";
  let last = 0;
  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    if (Date.now() - last < 4000) return say("Please wait a few seconds between messages.");
    last = Date.now(); send.disabled = true;
    try {
      await addDoc(messagesRef, { text, authorUid: user.uid, authorName: profile.fullName, role: profile.role, createdAt: serverTimestamp() });
      input.value = "";
    } catch (e) { say("Could not send. Please try again."); }
    send.disabled = false;
  }
  send.addEventListener("click", sendMessage);
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") sendMessage(); });
  form.append(input, send); box.append(form);

  return () => unsubs.forEach((u) => u());
            }
