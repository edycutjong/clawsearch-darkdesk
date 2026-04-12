import type { Transform } from "codemod:ast-grep";
import type JS from "codemod:ast-grep/langs/javascript";
import type TS from "codemod:ast-grep/langs/typescript";
import type TSX from "codemod:ast-grep/langs/tsx";

const transform: Transform<TS | TSX | JS> = async (root) => {
  const rootNode = root.root();

  // Rule 1: new Connection(...) -> createSolanaRpc(...)
  const connections = rootNode.findAll({
    rule: { pattern: "new Connection($URL)" },
  });
  const editsConnection = connections.map((node) => {
    const url = node.getMatch("URL")?.text() || "";
    return node.replace(`createSolanaRpc(${url})`);
  });

  // Rule 2: new PublicKey(...) -> address(...)
  const publicKeys = rootNode.findAll({
    rule: { pattern: "new PublicKey($KEY)" },
  });
  const editsPublicKey = publicKeys.map((node) => {
    const key = node.getMatch("KEY")?.text() || "";
    return node.replace(`address(${key})`);
  });

  // Rule 3: update imports from "@solana/web3.js"
  const imports = rootNode.findAll({
    rule: { pattern: 'import { $$$IMPORTS } from "@solana/web3.js"' },
  });
  
  const editsImports = imports.map((node) => {
    let text = node.text();
    text = text.replace(/\bConnection\b/g, "createSolanaRpc");
    text = text.replace(/\bPublicKey\b/g, "address");
    text = text.replace(/@solana\/web3\.js/g, "@solana/kit");
    return node.replace(text);
  });

  const newSource = rootNode.commitEdits([
    ...editsConnection,
    ...editsPublicKey,
    ...editsImports,
  ]);
  return newSource;
};

export default transform;
