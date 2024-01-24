# Setup wasm-tools

👩‍💻 [wasm-tools](https://github.com/bytecodealliance/wasm-tools) installer for GitHub Actions

<table align=center><td>

```yml
- uses: jcbhmr/setup-wasm-tools@v2
- run: cargo build --target wasm32-wasi
- run: wasm-tools print target/wasm32-wasi/debug/*.wasm
```

</table>

🟪 Installs wasm-tools globally \
🔢 Supports semver ranges \
📁 Caches the wasm-tools installation

## Usage

![GitHub Actions](https://img.shields.io/static/v1?style=for-the-badge&message=GitHub+Actions&color=2088FF&logo=GitHub+Actions&logoColor=FFFFFF&label=)
![GitHub](https://img.shields.io/static/v1?style=for-the-badge&message=GitHub&color=181717&logo=GitHub&logoColor=FFFFFF&label=)

**🚀 Here's what you're after:**

```yml
on: push
jobs:
  job:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: jcbhmr/setup-wasm-tools@v2
      - run: cargo build --target wasm32-wasi
      - run: wasm-tools print target/wasm32-wasi/debug/*.wasm
```

### Inputs

- **`wasm-tools-version`:** Which version of wasm-tools to install. This can be an exact version specifier such as `1.0.0` or a semver range like `~1.0.0` or `1.x`. Use `latest` to always install the latest release. Defaults to `latest`.

- **`wasm-tools-token`:** The GitHub token to use when fetching the version list from [bytecodealliance/wasm-tools](https://github.com/bytecodealliance/wasm-tools/releases). You shouldn't have to touch this. The default is the `github.token` if you're on github.com or unauthenticated (rate limited) if you're not on github.com.

### Outputs

- **`wasm-tools-version`:** The version of wasm-tools that was installed. This will be something like `1.0.0` or similar.

- **`cache-hit`:** Whether or not wasm-tools was restored from the runner's cache or download anew.

## Development

![Node.js](https://img.shields.io/static/v1?style=for-the-badge&message=Node.js&color=339933&logo=Node.js&logoColor=FFFFFF&label=)

**How do I test my changes?** \
Open a Draft Pull Request and some magic GitHub Actions will run to test the action.
