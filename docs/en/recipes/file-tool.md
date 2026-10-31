# File and image tools

examples/file-tool demonstrates trusted selection, scoped reads, statistics, PNG processing, export, directory bindings and clipboard. User files are input, not package assets. A temporary fileId is not a permanent disk path.

## Bounded file pipeline

files.open returns a read-only temporary handle. Read finite offset/length chunks using files.read, verify returned offset/eof and always files.close. With multiple:true the return shape is {files}; do not treat it as a single file. Dropped and clipboard-imported files have the same temporary read-only boundary.

Move pure computation to a Worker. Bound image dimensions and pixel counts as well as compressed bytes. Separate computation from preview and release Workers, object URLs, canvases and handles on cancellation. Handle empty, oversized, corrupt and wrong-type content explicitly.

## Export and directory writes

exports.begin declares a name and exact sizeBytes; exports.write writes Base64 at offsets; exports.save opens the actual trusted save flow. Close exportId on success, cancellation and failure. Before save, staging does not modify the target content; actual selection and overwrite remain trusted operations.

Directory reads are base functions restricted to user bindings. Writes require directory.write and remain within that binding. Removal is single-item, not recursive arbitrary disk deletion. directory.watch reports a need to rescan; rebuild a bounded paged view rather than treating events as reliable full history.

Image output may be saved or copied after clipboard authorization; denial should preserve export. Do not execute pasted HTML. Verify overwrite/cancel, binding revocation, leaving during reads, invalidated watches and failed exports. Read [file-tool details](../reference/modules/file-tool.md) and [desktop extensions](../reference/contracts/desktop-extensions.md).
