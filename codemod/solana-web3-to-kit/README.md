# solana-web3-to-kit

Transform solana/web3.js calls to solana-kit

## Installation

```bash
# Install from registry
codemod run solana-web3-to-kit

# Or run locally
codemod run -w workflow.yaml
```

## Usage

This codemod transforms typescript code by:

- Converting `var` declarations to `const`/`let`
- Removing debug statements
- Modernizing syntax patterns

## Development

```bash
# Test the transformation
npm test

# Validate the workflow
codemod validate -w workflow.yaml

# Publish to registry
codemod login
codemod publish
```

## License

MIT 