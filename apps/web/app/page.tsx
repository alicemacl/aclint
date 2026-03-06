export default function Home() {
  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui" }}>
      <h1>A11y Lens Test</h1>
      <p>Use Ctrl+Shift+A (or Cmd+Shift+A on Mac) to open the accessibility overlay.</p>
      <section style={{ marginTop: "2rem" }}>
        <h2>Interactive elements to test</h2>
        <p>
          <a href="#test">Test link</a>
        </p>
        <p>
          <button type="button">Button</button>
        </p>
        <p>
          <label htmlFor="input-demo">
            Label
            <input id="input-demo" type="text" placeholder="Type here" />
          </label>
        </p>
      </section>
    </main>
  );
}
