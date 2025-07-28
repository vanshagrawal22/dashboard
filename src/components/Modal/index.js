import Button from "../FormControls/button";
import Input from "../FormControls/input";
import Select from "../FormControls/select";

export default function Modal({ show, title, formControls = [], onAdd }) {
  return (
    <>
      {show ? (
        <>
          <div className="justify-center item-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-3xl ">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-slate-200">
                  <h3 className="text-3xl font-semibold">{title}</h3>
                </div>

                <div className="relative p-5 flex-auto flex flex-col gap-5">
                  {formControls && formControls.length > 0
                    ? formControls.map((item) =>
                        item.componentType === "input" ? (
                          <Input
                            type={item.type}
                            placeholder={item.placeholder}
                            label={item.label}
                          />
                        ) : item.componentType === "select" ? (
                          <Select label={item.label} options={item.options} />
                        ) : null
                      )
                    : null}
                </div>
                <div className="flex gap-2 items-center justify-end p-6 border-t border-solid rounded-b">
                  <Button text={"Add"} onClick={onAdd} />
                  <Button text={"Close"} />
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}
