Param()
Set-StrictMode -Version Latest

Write-Host "Installing the editable ResultSafe Python runtime..."
python -m pip install --upgrade pip
python -m pip install -e packages/python
