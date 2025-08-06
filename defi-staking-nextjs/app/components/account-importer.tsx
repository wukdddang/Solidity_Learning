import { useState } from "react";
import { IImportedAccount, getAccountFromPrivateKey } from "./web3-utils";

interface AccountImporterProps {
  customRpcUrl: string;
  onError: (error: string) => void;
}

export default function AccountImporter({
  customRpcUrl,
  onError,
}: AccountImporterProps) {
  const [privateKey, setPrivateKey] = useState<string>("");
  const [importedAccount, setImportedAccount] =
    useState<IImportedAccount | null>(null);

  const importAccountFromPrivateKey = async () => {
    try {
      if (!privateKey) {
        onError("비밀키를 입력해주세요.");
        return;
      }

      const account = await getAccountFromPrivateKey(privateKey, customRpcUrl);
      setImportedAccount(account);
      onError(""); // 에러 클리어
      console.log("✅ 계정 정보 확인 완료!");
      console.log("MetaMask로 계정을 가져오려면:");
      console.log("1. MetaMask > 계정 메뉴 > 계정 가져오기");
      console.log("2. 비밀키 입력:", "0x" + privateKey.replace("0x", ""));
    } catch (err: any) {
      console.error("계정 가져오기 오류:", err);
      onError(`계정 가져오기에 실패했습니다: ${err.message}`);
    }
  };

  const clearImportedAccount = () => {
    setPrivateKey("");
    setImportedAccount(null);
    onError("");
  };

  return (
    <div className="bg-blue-50 p-4 rounded-lg">
      <h4 className="text-sm font-semibold text-blue-700 mb-2">
        🔑 Ganache 테스트 계정 가져오기
      </h4>
      <div className="space-y-3">
        <div className="flex space-x-2">
          <input
            type="password"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            placeholder="Ganache 계정의 비밀키를 입력하세요"
            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={importAccountFromPrivateKey}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm transition-colors"
          >
            확인
          </button>
          {importedAccount && (
            <button
              onClick={clearImportedAccount}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded text-sm transition-colors"
            >
              초기화
            </button>
          )}
        </div>

        {importedAccount && (
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <h5 className="text-sm font-semibold text-green-800 mb-2">
              ✅ 계정 정보 확인 완료
            </h5>
            <div className="text-xs space-y-1">
              <p className="text-green-700">
                <strong>주소:</strong> {importedAccount.address}
              </p>
              <p className="text-green-700">
                <strong>ETH 잔액:</strong> {importedAccount.ethBalance} ETH
              </p>
              <p className="text-green-700">
                <strong>테더 잔액:</strong> {importedAccount.tetherBalance} USDT
              </p>
            </div>
            <div className="mt-2 p-2 bg-yellow-100 border border-yellow-300 rounded text-xs">
              <p className="text-yellow-800">
                💡 <strong>MetaMask로 계정 가져오기:</strong>
              </p>
              <ol className="text-yellow-700 mt-1 list-decimal list-inside">
                <li>MetaMask &gt; 계정 메뉴 &gt; "계정 가져오기" 클릭</li>
                <li>위에 입력한 비밀키 붙여넣기</li>
                <li>"가져오기" 클릭</li>
              </ol>
            </div>
          </div>
        )}

        <p className="text-xs text-blue-600">
          Ganache 계정의 비밀키를 입력하면 해당 계정의 ETH 잔액과 테더(USDT)
          잔액을 확인할 수 있습니다
        </p>
      </div>
    </div>
  );
}
